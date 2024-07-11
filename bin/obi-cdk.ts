#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
// import { ObiCdkStack } from '../lib/obi-cdk-stack';
import { PipelineStack } from '../lib/pipeline-stack';
import * as fs from 'fs';

// Read and parse the cdk.context.json file
const context = JSON.parse(fs.readFileSync('cdk.context.json', 'utf-8'));
const pipeline = context.stages.find((stage: any) => stage.envName === 'DEV');

const app = new cdk.App();
new PipelineStack(app, 'ObiCdkStack', {
  env: {
    account: pipeline.accountId,
    region: 'us-west-2',
  }
});