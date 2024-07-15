import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {
    EnvironmentConfigs
  } from '../constants/constants'
import * as cdk from 'aws-cdk-lib';

export class DatabaseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const config = EnvironmentConfigs[this.account];
    const vpcId = config.vpcId[this.region]
    const subnetId1 = config.appSubnets[this.region][0]
    const subnetId2 = config.appSubnets[this.region][1]


    // Private VPC Subnets and Security Group
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
        vpcId: vpcId,
    })

    // App subnet
    const subnets = [
        ec2.Subnet.fromSubnetId(this, 'subnet1', subnetId1),
        ec2.Subnet.fromSubnetId(this, 'subnet2', subnetId2),
    ]

    const securityGroup = new ec2.SecurityGroup(this, 'RdsSecurityGroup', {
        vpc,
        description: 'Allow RDS access',
        allowAllOutbound: true,
        });

    securityGroup.addIngressRule(
        ec2.Peer.anyIpv4(),
        ec2.Port.tcp(3306),
        'Allow MySQL access'
    );

    // Create the serverless RDS cluster
    const rdsCluster = new rds.ServerlessCluster(this, 'ServerlessRdsCluster', {
        engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
        vpc,
        backupRetention: cdk.Duration.days(7),
        defaultDatabaseName: 'obi-wooCommerceDB',
        scaling: {
          autoPause: cdk.Duration.minutes(10), // Auto pause after 10 minutes of inactivity
          minCapacity: rds.AuroraCapacityUnit.ACU_2, // Minimum capacity
          maxCapacity: rds.AuroraCapacityUnit.ACU_4, // Maximum capacity
        },
        vpcSubnets: {
            subnets: subnets,
        },
        securityGroups: [securityGroup],
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
    }
}
