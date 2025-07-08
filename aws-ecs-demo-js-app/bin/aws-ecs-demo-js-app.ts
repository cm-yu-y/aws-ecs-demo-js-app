#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsEcsDemoJsAppStack } from '../lib/aws-ecs-demo-js-app-stack';
import { devParameters } from '../lib/parameters/dev';
import { prodParameters } from '../lib/parameters/prod';

const app = new cdk.App();

// Development environment
new AwsEcsDemoJsAppStack(app, 'AwsEcsDemoJsAppStack-Dev', {
  parameters: devParameters,
  env: { 
    account: devParameters.aws.account, 
    region: devParameters.aws.region 
  },
});

// Production environment  
new AwsEcsDemoJsAppStack(app, 'AwsEcsDemoJsAppStack-Prod', {
  parameters: prodParameters,
  env: { 
    account: prodParameters.aws.account, 
    region: prodParameters.aws.region 
  },
});