#!/bin/bash

CONTEXT_FILE="cdk.context.json"
REGION_1="us-west-2"
REGION_2="us-east-1"
STAGES=$(jq -c '.stages[]' $CONTEXT_FILE)

for stage in $STAGES; do
    ACCOUNT_ID=$(echo $stage | jq -r '.accountId')
    ENV_NAME=$(echo $stage | jq -r '.envName')
    
    if [[ $ACCOUNT_ID != "null" ]]; then
        echo "Bootstrapping for environment: $ENV_NAME, account: $ACCOUNT_ID, region: $REGION_1"
        cdk bootstrap aws://$ACCOUNT_ID/$REGION_1
        echo "Bootstrap completed for environment: $ENV_NAME, account: $ACCOUNT_ID, region: $REGION_1"
        echo "Bootstrapping for environment: $ENV_NAME, account: $ACCOUNT_ID, region: $REGION_2"
        cdk bootstrap aws://$ACCOUNT_ID/$REGION_2
        echo "Bootstrap completed for environment: $ENV_NAME, account: $ACCOUNT_ID, region: $REGION_2"
    fi
done