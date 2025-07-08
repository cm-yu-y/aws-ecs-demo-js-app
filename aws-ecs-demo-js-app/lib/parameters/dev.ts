import { Parameters } from '../parameters';

export const devParameters: Parameters = {
  projectName: 'aws-ecs-demo-js-app',
  environment: 'dev',
  aws: {
    account: '123451234512',
    region: 'ap-northeast-1',
  },
  vpc: {
    cidr: '10.0.0.0/16',
    maxAzs: 2,
  },
  ecr: {
    repositoryName: 'demo-js-app',
  },
  ecs: {
    taskDefinitionArnSsmParameter: '/ecs/aws-ecs-demo-js-app/dev/task-definition-arn',
    containerName: 'nginx',
    containerPort: 80,
    desiredCount: 1,
  },
  alb: {
    port: 80,
    healthCheckPath: '/health',
  },
};
