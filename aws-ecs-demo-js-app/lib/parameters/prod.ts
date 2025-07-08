import { Parameters } from '../parameters';

export const prodParameters: Parameters = {
  projectName: 'aws-ecs-demo-js-app',
  environment: 'prod',
  aws: {
    account: '123451234512',
    region: 'ap-northeast-1',
  },
  vpc: {
    cidr: '10.1.0.0/16',
    maxAzs: 3,
  },
  ecr: {
    repositoryName: 'demo-js-app',
  },
  ecs: {
    taskDefinitionArnSsmParameter: '/ecs/aws-ecs-demo-js-app/prod/task-definition-arn',
    containerName: 'nginx',
    containerPort: 80,
    desiredCount: 3,
  },
  alb: {
    port: 80,
    healthCheckPath: '/health',
  },
};