import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Parameters } from './parameters';
import { VpcConstruct } from './constructs/vpc-construct';
import { AlbConstruct } from './constructs/alb-construct';
import { EcsConstruct } from './constructs/ecs-construct';

export interface AwsEcsDemoJsAppStackProps extends cdk.StackProps {
  readonly parameters: Parameters;
}

export class AwsEcsDemoJsAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsEcsDemoJsAppStackProps) {
    super(scope, id, props);

    const vpcConstruct = new VpcConstruct(this, 'VPC', {
      parameters: props.parameters,
    });

    const albConstruct = new AlbConstruct(this, 'ALB', {
      parameters: props.parameters,
      vpc: vpcConstruct.vpc,
    });

    const ecsConstruct = new EcsConstruct(this, 'ECS', {
      parameters: props.parameters,
      vpc: vpcConstruct.vpc,
      targetGroup: albConstruct.targetGroup,
      albSecurityGroup: albConstruct.albSecurityGroup,
    });

    ecsConstruct.service.addDependency(albConstruct.listener.node.defaultChild as cdk.CfnResource);

    new cdk.CfnOutput(this, 'AlbDnsName', {
      value: albConstruct.alb.loadBalancerDnsName,
      description: 'ALB DNS Name',
    });

    new cdk.CfnOutput(this, 'ClusterArn', {
      value: ecsConstruct.cluster.clusterArn,
      description: 'ECS Cluster ARN',
    });
  }
}
