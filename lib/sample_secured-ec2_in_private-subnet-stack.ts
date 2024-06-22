import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SampleSecuredEc2InPrivateSubnetStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    // PrivateSubnet has a route to NAT Gateway (0.0.0.0/16 -> ngw)
    // PublicSubnet has a route to Internet Gateway (0.0.0.0/16 -> igw)
    const vpc = new cdk.aws_ec2.Vpc(this, "SampleVpc", {
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
      maxAzs: 1,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "PrivateSubnet",
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: "PublicSubnet",
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
        },
      ],
      gatewayEndpoints: {
        S3: {
          service: ec2.GatewayVpcEndpointAwsService.S3,
        },
      },
    });

    const endpointSg = new ec2.SecurityGroup(this, "VPCEndpointSG", {
      vpc,
      allowAllOutbound: false,
    });

    vpc.addInterfaceEndpoint("SSMEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.SSM,
      securityGroups: [endpointSg],
    });

    vpc.addInterfaceEndpoint("SSMMessagesEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.SSM_MESSAGES,
      securityGroups: [endpointSg],
    });

    vpc.addInterfaceEndpoint("EC2Endpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.EC2,
      securityGroups: [endpointSg],
    });

    vpc.addInterfaceEndpoint("EC2MessagesEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.EC2_MESSAGES,
      securityGroups: [endpointSg],
    });

    // EC2
    const ec2Instance = new ec2.Instance(this, "Instance", {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      vpc,
      availabilityZone: vpc.availabilityZones[0],
      ssmSessionPermissions: true,
    });
  }
}
