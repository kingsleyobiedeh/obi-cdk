export const HOST_NAME = 'notification'

export const ALIAS_NAME = 'WNS'

interface EnvironmentConfig {
    env: string;
    domainName: string;
    certificateArn: Record<string, string>;
    vpcId: Record<string, string>;
    appSubnets: Record<string, string[]>;
    lbSubnets: Record<string, string[]>;
}

export const EnvironmentConfigs: Record<string, EnvironmentConfig> = {
    '471112589625': {
        env: 'DEV',
        domainName: 'walletdev',
        certificateArn: {
            "us-east-1": 'arn:aws:acm:us-east-1:421821786650:certificate/14f1ff24-2fc9-457a-99c7-017f870c4d26',
            "us-west-2": 'arn:aws:acm:us-west-2:421821786650:certificate/edb6a7f2-0fed-49ad-88fb-3ee1f87e6bc0',
        },
        vpcId: {
            "us-east-1": 'vpc-0b1de0f35fd94fe81',
            "us-west-2": 'vpc-099d7f9286221b2c7',
        },
        appSubnets: {
            "us-east-1": ['subnet-0256ddbb347b57fae', 'subnet-02a5ed1780365903d'],
            "us-west-2": ['subnet-002c4ca4fac6e9675', 'subnet-08240bd5816fc71d0'],
        },
        lbSubnets: {
            "us-east-1": ['subnet-01dcfa046f84bc922', 'subnet-09384452edca5399f'],
            "us-west-2": ['subnet-08c0bc6aa97d5a35c', 'subnet-0a34b1e6562d6d99f'],
        },
    },
    '764138565131': {
        env: 'INT',
        domainName: 'walletint',
        certificateArn: {
            "us-east-1": 'arn:aws:acm:us-east-1:764138565131:certificate/6c622bbb-737c-43af-8469-f6545e2c1995',
            "us-west-2": 'arn:aws:acm:us-west-2:764138565131:certificate/085dccd2-ab93-401e-9069-73468fedcdae',
        },
        vpcId: {
            "us-east-1": 'vpc-01fca271cbd9cf293',
            "us-west-2": 'vpc-0c0603d532dd6f7d5',
        },
        appSubnets: {
            "us-east-1": ['subnet-09a3dd275989097bd', 'subnet-086b07563e433c5d8'],
            "us-west-2": ['subnet-0c9a1c03474768c5e', 'subnet-0e7d689b06b9b4bf8'],
        },
        lbSubnets: {
            "us-east-1": ['subnet-06147d431480deae6', 'subnet-0020af732bb8ed94f'],
            "us-west-2": ['subnet-0fd85633de349b863', 'subnet-011a82ab7935440f1'],
        },
    },
    '577784902705': {
        env: 'STG',
        domainName: 'walletstg',
        certificateArn: {
            "us-east-1": 'arn:aws:acm:us-east-1:577784902705:certificate/9a57546f-5826-4322-9173-a49cec14c475',
            "us-west-2": 'arn:aws:acm:us-west-2:577784902705:certificate/dce2fe23-6609-4179-8b6c-523910f5315a',
        },
        vpcId: {
            "us-east-1": 'vpc-01f175f2a674f417c',
            "us-west-2": 'vpc-04d9ff7d',
        },
        appSubnets: {
            "us-east-1": ['subnet-0e385709b7af1b1bc', 'subnet-05a967e1674b577b1'],
            "us-west-2": ['subnet-0bec7b1e5a0a376df', 'subnet-0d293ca707a6e8814'],
        },
        lbSubnets: {
            "us-east-1": ['subnet-0e993b0d65d30c342', 'subnet-067c14464fad41378'],
            "us-west-2": ['subnet-16c76a5d', 'subnet-6bf87b12'],
        },
    },
    '806245620044': {
        env: 'PRD',
        domainName: 'wallet',
        certificateArn: {
            "us-east-1": 'arn:aws:acm:us-east-1:806245620044:certificate/fb246b72-15d3-4866-83d6-e18d7a4a3c33',
            "us-west-2": 'arn:aws:acm:us-west-2:806245620044:certificate/6b562efe-b1be-4e18-8023-f8340b0d860a',
        },
        vpcId: {
            "us-east-1": 'vpc-58b43d3e',
            "us-west-2": 'vpc-0535e63f7bc7670ec',
        },
        appSubnets: {
            "us-east-1": ['subnet-0cf35fbc081007f4d', 'subnet-038ecb727162399bc'],
            "us-west-2": ['subnet-0e1fdafc2221648df', 'subnet-057cfdcb792ed0d83'],
        },
        lbSubnets: {
            "us-east-1": ['subnet-62b0cf39', 'subnet-852214cc'],
            "us-west-2": ['subnet-0c5732b0b38445d10', 'subnet-0ebc3b1b161cf38c1'],
        },
    },
};

export const ROUTE_53 =  {
    port: "443",
    resourcePath: '/health',
    requestInterval: "30",
    failureThreshold: "3",
    type: 'A',
    evaluateTargetHealth: "true",
    failover: 'PRIMARY',
}

export const SERVICE: Record<string, Record<string, number>> = {
  DEV: {
    desiredCount: 1,
    minHealthyPercent: 75,
    maxHealthyPercent: 200,
    healthCheckGracePeriod: 30,
  },
  INT: {
    desiredCount: 2,
    minHealthyPercent: 75,
    maxHealthyPercent: 200,
    healthCheckGracePeriod: 30,
  },
  STG: {
    desiredCount: 2,
    minHealthyPercent: 75,
    maxHealthyPercent: 200,
    healthCheckGracePeriod: 30,
  },
  PRD: {
    desiredCount: 2,
    minHealthyPercent: 75,
    maxHealthyPercent: 200,
    healthCheckGracePeriod: 30,
  },
}

export const AUTOSCALING: Record<string, Record<string, number>> = {
  DEV: {
    minCapacity: 1,
    maxCapacity: 2,
    upper: 20,
    upperchange: -1,
    lower: 70,
    lowerchange: +1,
    cooldown: 60,
    datapointsToAlarm: 2,
    evaluationPeriods: 2,
    period: 1,
    targetValue: 80,
  },
  INT: {
    minCapacity: 2,
    maxCapacity: 5,
    upper: 20,
    upperchange: -1,
    lower: 70,
    lowerchange: +1,
    cooldown: 60,
    datapointsToAlarm: 2,
    evaluationPeriods: 2,
    period: 1,
    targetValue: 80,
  },
  STG: {
    minCapacity: 2,
    maxCapacity: 5,
    upper: 20,
    upperchange: -1,
    lower: 70,
    lowerchange: +1,
    cooldown: 60,
    datapointsToAlarm: 2,
    evaluationPeriods: 2,
    period: 1,
    targetValue: 80,
  },
  PRD: {
    minCapacity: 2,
    maxCapacity: 5,
    upper: 20,
    upperchange: -1,
    lower: 70,
    lowerchange: +1,
    cooldown: 60,
    datapointsToAlarm: 2,
    evaluationPeriods: 2,
    period: 1,
    targetValue: 80,
  },
}

export const TG = {
    port: 80,
    containerPort: 8080,
    path: '/actuator/health',
    interval: 30,
    timeout: 10,
    healthyThresholdCount: 3,
    unhealthyThresholdCount: 3,
    healthyHttpCodes: '200-299',
}

export const TASK_DEFINITION = {
    cpu: 2048,
    memoryLimitMiB: 4096,
    family: 'notification-service-td',
}

type SecurityGroupRule = {
  protocol: 'HTTPS' | 'HTTP' | 'Custom TCP'
  port: number
  sourceIp: string
}

export const LB_SG_RULE: SecurityGroupRule[] = [
  { protocol: 'HTTPS', port: 443, sourceIp: '107.23.255.0/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '15.177.0.0/18' },
  { protocol: 'HTTPS', port: 443, sourceIp: '176.34.159.192/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '177.71.207.128/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.183.255.128/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.228.16.0/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.232.40.64/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.241.32.64/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.243.31.192/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.244.52.192/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.245.168.0/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.248.220.0/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.250.253.192/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.251.31.128/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.252.254.192/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.252.79.128/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.255.254.192/26' },
  { protocol: 'HTTPS', port: 443, sourceIp: '10.0.0.0/8' },
  { protocol: 'Custom TCP', port: 8443, sourceIp: '10.0.0.0/8' },
  { protocol: 'Custom TCP', port: 8443, sourceIp: '132.188.0.0/16' },
  { protocol: 'HTTPS', port: 443, sourceIp: '132.188.0.0/16' },
  { protocol: 'HTTPS', port: 443, sourceIp: '203.202.234.0/24' },
  { protocol: 'Custom TCP', port: 8443, sourceIp: '203.202.234.0/24' },
  { protocol: 'HTTPS', port: 443, sourceIp: '50.112.147.32/32' },
  { protocol: 'Custom TCP', port: 8443, sourceIp: '50.112.147.32/32' },
  { protocol: 'Custom TCP', port: 8443, sourceIp: '50.112.147.42/32' },
  { protocol: 'HTTPS', port: 443, sourceIp: '50.112.147.42/32' },
  { protocol: 'Custom TCP', port: 8443, sourceIp: '54.71.82.69/32' },
  { protocol: 'HTTPS', port: 443, sourceIp: '54.71.82.69/32' },
]

export const FAILOVER_MODE: Record<string, string> = {
    "us-east-1": 'SECONDARY',
    "us-west-2": 'PRIMARY',
}
