import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { Parameters } from '../parameters';

export interface EcsConstructProps {
  readonly parameters: Parameters;
  readonly vpc: ec2.Vpc;
  readonly targetGroup: elbv2.ApplicationTargetGroup;
  readonly albSecurityGroup: ec2.SecurityGroup;
}

export class EcsConstruct extends Construct {
  public readonly cluster: ecs.Cluster;
  public readonly service: ecs.CfnService;
  public readonly serviceSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: EcsConstructProps) {
    super(scope, id);

    this.cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: props.vpc,
      clusterName: `${props.parameters.projectName}-${props.parameters.environment}-cluster`,
    });

    this.serviceSecurityGroup = new ec2.SecurityGroup(this, 'ServiceSecurityGroup', {
      vpc: props.vpc,
      description: 'Security group for ECS service',
      allowAllOutbound: true,
    });

    this.serviceSecurityGroup.addIngressRule(
      props.albSecurityGroup,
      ec2.Port.tcp(props.parameters.ecs.containerPort),
      'Allow inbound traffic from ALB only'
    );

    const taskDefinitionArn = ssm.StringParameter.valueFromLookup(
      this,
      props.parameters.ecs.taskDefinitionArnSsmParameter
    );

    this.service = new ecs.CfnService(this, 'Service', {
      cluster: this.cluster.clusterArn,
      taskDefinition: taskDefinitionArn,
      desiredCount: props.parameters.ecs.desiredCount,
      serviceName: `${props.parameters.projectName}-${props.parameters.environment}-service`,
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: props.vpc.privateSubnets.map(subnet => subnet.subnetId),
          securityGroups: [this.serviceSecurityGroup.securityGroupId],
          assignPublicIp: 'DISABLED',
        },
      },
      loadBalancers: [{
        targetGroupArn: props.targetGroup.targetGroupArn,
        containerName: props.parameters.ecs.containerName,
        containerPort: props.parameters.ecs.containerPort,
      }],
    });
  }
}