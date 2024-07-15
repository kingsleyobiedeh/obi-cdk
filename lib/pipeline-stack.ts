import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { PipelineAppStage } from './pipeline-app-stage';

interface StageConfig {
    accountId: string;
    region: string;
    envName: string;
  }

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Read the context from cdk.context.json
    const stages: StageConfig[] = this.node.tryGetContext('stages');

    if (!stages) {
        throw new Error('Stage configurations not found in cdk.context.json');
    }

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'Obi-Pipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('StemcellTeam/obi-cdk', 'master'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    // Track environments already added to waves to ensure uniqueness
    const addedEnvironments: Set<string> = new Set();

    // Iterate through stage configurations and add to appropriate waves
    stages.forEach(stage => {
      if (!addedEnvironments.has(stage.envName)) {
        // Create a new wave for each environment to handle different regions
        const wave = pipeline.addWave(`${stage.envName}-wave`);
        addedEnvironments.add(stage.envName);

        // Filter stages for the current environment
        const stagesForEnv = stages.filter(s => s.envName === stage.envName);

        // Add stages for the current environment to the wave
        stagesForEnv.forEach(envStage => {
          const pipelineStage = new PipelineAppStage(this, `${envStage.envName}-${envStage.region}`, {
            env: {
              account: envStage.accountId,
              region: envStage.region,
            }
          });

          // Add each stage to the wave for parallel execution
          wave.addStage(pipelineStage);

          // TODO Add manual approval step to the testing stage
          
        });

      }
    });
  }
}