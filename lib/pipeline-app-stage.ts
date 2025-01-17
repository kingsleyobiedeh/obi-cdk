import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { ComputeStack } from './compute-stack';
import { DatabaseStack } from './database-stack';

export class PipelineAppStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
      super(scope, id, props);

      const compute = new ComputeStack(this, 'ComputeStack');

      const database = new DatabaseStack(this, 'DatabaseStack');
    }
}