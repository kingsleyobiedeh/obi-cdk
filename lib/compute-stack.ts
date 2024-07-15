import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as route53 from 'aws-cdk-lib/aws-route53';
import {
    ALIAS_NAME,
    HOST_NAME,
    EnvironmentConfigs
  } from '../constants/constants'


export class ComputeStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = EnvironmentConfigs[this.account];
        const vpcId = config.vpcId[this.region];
        const subnetId1 = config.appSubnets[this.region][0];
        const subnetId2 = config.appSubnets[this.region][1];
        const DOMAIN_NAMES = config.domainName;

        // Private VPC Subnets and Security Group
        const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
            vpcId: vpcId,
        });

        // App subnet
        const subnets = [
            ec2.Subnet.fromSubnetId(this, 'subnet1', subnetId1),
            ec2.Subnet.fromSubnetId(this, 'subnet2', subnetId2),
        ];

        // App security group & Ingress rule
        const securityGroupName = `${ALIAS_NAME}-Sg`;
        
        const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
            securityGroupName,
            vpc,
        });
    
        // Cluster
        const cluster = new ecs.Cluster(this, 'Cluster', {
            vpc: vpc,
            containerInsights: true,
            clusterName: ALIAS_NAME,
        });

        // Build dockerfile and publish to ecr. Remove comment if you want build from app source code
        // const dockerImageAsset = new ecrasset.DockerImageAsset(this, 'appDockerImage', {
        //     directory: '.',
        //     target: 'bundle',
        // })

        // Use ecs pattern loadbalanced fargate
        const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
            cluster,
            memoryLimitMiB: 1024,
            desiredCount: 2,
            cpu: 512,
            taskImageOptions: {
                // use this dockerImage Asset to do build
                // image: ecs.ContainerImage.fromDockerImageAsset(dockerImageAsset),
                image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")
            },
            taskSubnets: {
            subnets: subnets,
            },
            minHealthyPercent: 75,
            maxHealthyPercent: 200,
            protocol: elbv2.ApplicationProtocol.HTTP,
            securityGroups: [securityGroup],
        });

    // Define a latency-based Route 53 record to route traffic to ALB
    const latencyRecord = new route53.ARecord(this, 'LatencyRecord', {
        zone: route53.HostedZone.fromLookup(this, 'MyZone', { domainName: DOMAIN_NAMES }),
        recordName: `${this.region}.${HOST_NAME}.${DOMAIN_NAMES}`,
        target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(loadBalancedFargateService.loadBalancer)),
        ttl: cdk.Duration.minutes(5),
        region: this.region
    });
    }
}