# Access EC2 instance in private subnet via Systems Manager

In this sample script, I will show you how you can secure the EC2 instances which do not require in-bound connection. Please find the attached diagram for detail.

![](/sample_secured-ec2_in_private-subnet.drawio.png)

As I describe the diagram, there are no internet facing resources. This mean you can keep your environment secure without maintaining such 'complex' resources. And as for the resources, all resources except EC2 in this stack are AWS managed.

# How to run this script

Before you run this script, you need to install `aws-cdk` and connection to AWS via CLI. For more information, see [AWS Cloud Development Kit (AWS CDK) v2](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html). You also need to set up the Node.js environment.

## Deploy stack

```shell
cdk bootstrap
cdk deploy
```

## Connect EC2 via Systems Manager

1. Open AWS Management Console
2. Navigate to EC2, and find the EC2 instance to connect
3. Click "Connect"
4. Connect via Systems Manager
5. You can see the console

## Destroy stack

```shell
cdk destroy
```
