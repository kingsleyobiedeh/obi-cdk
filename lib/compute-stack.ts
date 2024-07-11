import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53'
import {
    ALIAS_NAME,
    FAILOVER_MODE,
    HOST_NAME,
    LB_SG_RULE,
    ROUTE_53,
    EnvironmentConfigs
  } from '../constants/constants'

export interface ComputeStackProps extends cdk.StackProps {
    envName: string
}

export class ComputeStack extends cdk.Stack {
    readonly envName: string
    constructor(scope: Construct, id: string, props?: ComputeStackProps) {
        super(scope, id, props);
        


        /* ****************************************************** */
        /* *************** Env/Branch specific suffix *********** */
        /* ****************************************************** */
        
        /* istanbul ignore next */
        console.log(this.account)
        console.log(this.region)
        const config = EnvironmentConfigs[this.account];
        console.log(config.appSubnets[this.region][0])
        const vpcId = config.vpcId[this.region]
        const subnetId1 = config.appSubnets[this.region][0]
        const subnetId2 = config.appSubnets[this.region][1]
        const subnetLb1 = config.lbSubnets[this.region][0]
        const subnetLb2 = config.lbSubnets[this.region][1]
        const route_53 = ROUTE_53
        const DOMAIN_NAMES = config.domainName
        // const zoneName = DOMAIN_NAMES
        const failoverMode = FAILOVER_MODE[this.region]

        // Private VPC Subnets and Security Group
        const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
        vpcId: vpcId,
        })

        // App subnet
        const subnets = [
        ec2.Subnet.fromSubnetId(this, 'subnet1', subnetId1),
        ec2.Subnet.fromSubnetId(this, 'subnet2', subnetId2),
        ]
        // LB subnet
        const LbSubnets = [
        ec2.Subnet.fromSubnetId(this, 'subnetLb1', subnetLb1),
        ec2.Subnet.fromSubnetId(this, 'subnetLb2', subnetLb2),
        ]
        // LB security group & Ingress rule
        const securityGroupNameLb = `${ALIAS_NAME}-SgLb`;
        const securityGroupLb = new ec2.SecurityGroup(this, 'LbSecurityGroup', {
            securityGroupName: securityGroupNameLb,
            vpc: vpc,
        })
        for (const rule of LB_SG_RULE) {
        securityGroupLb.addIngressRule(ec2.Peer.ipv4(rule.sourceIp), ec2.Port.tcp(rule.port), 'Allow traffic')
        }
        new cdk.CfnOutput(this, `LbSecurityGroupId-${ALIAS_NAME}`, {
        value: securityGroupLb.securityGroupId,
        exportName: `LbSecurityGroupId-${ALIAS_NAME}`,
        })

    
        // Cluster
        const cluster = new ecs.Cluster(this, 'Cluster', {
        vpc: vpc,
        containerInsights: true,
        clusterName: ALIAS_NAME,
        })


        // Application Load balancer, Target group, listener and listener rule
        // ALB
        const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
        vpc: vpc,
        vpcSubnets: { subnets: LbSubnets },
        securityGroup: securityGroupLb,
        loadBalancerName: `${ALIAS_NAME}`,
        //internetFacing: false,
        })

        //// Create Route53 routing resources for our LoadBalancer
        const hostName = HOST_NAME
        const regionalHostName = `${this.region.toLowerCase()}.${HOST_NAME}`  

        const domainName = `${hostName}.${DOMAIN_NAMES}`

        // const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
        // domainName: DOMAIN_NAMES,
        // })

        // // This regional ALIAS_NAME is used to hit the loadbalancer in the current region.
        // const ARecord = new route53.CfnRecordSet(this, 'RegionalRecordSet', {
        // name: `${regionalHostName}.${DOMAIN_NAMES}`,
        // type: route_53['type'],
        // aliasTarget: {
        //     dnsName: alb.loadBalancerDnsName,
        //     hostedZoneId: alb.loadBalancerCanonicalHostedZoneId,
        //     evaluateTargetHealth: Boolean(route_53['evaluateTargetHealth']),
        // },
        // hostedZoneId: hostedZone.hostedZoneId,
        // })

        // const route53HealthCheck = new route53.CfnHealthCheck(this, 'HealthCheck', {
        //     healthCheckConfig: {
        //         type: 'HTTPS',
        //         failureThreshold: Number(route_53['failureThreshold']),
        //         fullyQualifiedDomainName: `${regionalHostName}.${DOMAIN_NAMES}`,
        //         port: Number(route_53['port']),
        //         requestInterval: Number(route_53['requestInterval']),
        //         resourcePath: route_53['resourcePath'],
        //         enableSni: true,
        //     },
        // })

        // This global ALIAS_NAME is used to hit the default primary region Arecord or failover to the secondary region.

        // const globalAlias = new route53.CfnRecordSet(this, 'GlobalRecordSet', {
        //     name: domainName,
        //     type: route_53['type'],
        //     aliasTarget: {
        //     dnsName: ARecord.name,
        //     hostedZoneId: hostedZone.hostedZoneId,
        //     evaluateTargetHealth: Boolean(route_53['evaluateTargetHealth']),
        //     },
        //     setIdentifier: regionalHostName + '_' + failoverMode,
        //     failover: failoverMode,
        //     hostedZoneId: hostedZone.hostedZoneId,
        //     healthCheckId: route53HealthCheck.attrHealthCheckId,
        // })
        // globalAlias.node.addDependency(ARecord)

        const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
            cluster,
            memoryLimitMiB: 1024,
            desiredCount: 1,
            cpu: 512,
            taskImageOptions: {
            image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
            },
            taskSubnets: {
            subnets: subnets,
            },
            loadBalancerName: 'application-lb-name',
        });
    }
}