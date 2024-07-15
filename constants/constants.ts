export const HOST_NAME = 'obi-bmo'

export const ALIAS_NAME = 'obi-bmo'

interface EnvironmentConfig {
    env: string;
    domainName: string;
    vpcId: Record<string, string>;
    appSubnets: Record<string, string[]>;
    lbSubnets: Record<string, string[]>;
}

export const EnvironmentConfigs: Record<string, EnvironmentConfig> = {
    '471112588888': {
        env: 'DEV',
        domainName: 'obibmodev',
        vpcId: {
            "us-east-1": 'vpc-0b1de0',
            "us-west-2": 'vpc-099d7f',
        },
        appSubnets: {
            "us-east-1": ['subnet-0256dd', 'subnet-02a5e'],
            "us-west-2": ['subnet-002c4c', 'subnet-08240b'],
        },
        lbSubnets: {
            "us-east-1": ['subnet-01dcfa0', 'subnet-09384452e'],
            "us-west-2": ['subnet-08c0bc', 'subnet-0a34b1f'],
        },
    },
    '577784904444': {
        env: 'UAT',
        domainName: 'obibmostg',
        vpcId: {
            "us-east-1": 'vpc-01f1',
            "us-west-2": 'vpc-04d94',
        },
        appSubnets: {
            "us-east-1": ['subnet-0e3857', 'subnet-05a964'],
            "us-west-2": ['subnet-0bec7b14', 'subnet-0d2934'],
        },
        lbSubnets: {
            "us-east-1": ['subnet-0e99', 'subnet-067c1'],
            "us-west-2": ['subnet-16c7', 'subnet-6bf84'],
        },
    },
    '806245623333': {
        env: 'PRD',
        domainName: 'obibmo',
        vpcId: {
            "us-east-1": 'vpc-58b4354e',
            "us-west-2": 'vpc-0535e63c',
        },
        appSubnets: {
            "us-east-1": ['subnet-0cf35fbc', 'subnet-038ecb727'],
            "us-west-2": ['subnet-0e1fdafc28994', 'subnet-057cfdc'],
        },
        lbSubnets: {
            "us-east-1": ['subnet-62b455', 'subnet-852214'],
            "us-west-2": ['subnet-0c5732b', 'subnet-0ebc3'],
        },
    },
};
