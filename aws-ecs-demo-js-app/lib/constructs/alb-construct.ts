import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Parameters } from '../parameters';

export interface AlbConstructProps {
  readonly parameters: Parameters;
  readonly vpc: ec2.Vpc;
}

export class AlbConstruct extends Construct {
  public readonly alb: elbv2.ApplicationLoadBalancer;
  public readonly targetGroup: elbv2.ApplicationTargetGroup;
  public readonly albSecurityGroup: ec2.SecurityGroup;
  public readonly listener: elbv2.ApplicationListener;

  constructor(scope: Construct, id: string, props: AlbConstructProps) {
    super(scope, id);

    this.albSecurityGroup = new ec2.SecurityGroup(this, 'AlbSecurityGroup', {
      vpc: props.vpc,
      description: 'Security group for ALB',
      allowAllOutbound: true,
    });

    this.alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc: props.vpc,
      internetFacing: true,
      loadBalancerName: `${props.parameters.projectName}-${props.parameters.environment}-alb`,
      securityGroup: this.albSecurityGroup,
    });

    this.targetGroup = new elbv2.ApplicationTargetGroup(this, 'TargetGroup', {
      vpc: props.vpc,
      port: props.parameters.ecs.containerPort,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        path: props.parameters.alb.healthCheckPath,
        healthyHttpCodes: '200',
        interval: Duration.seconds(30),
        timeout: Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
      },
      targetGroupName: `${props.parameters.projectName}-${props.parameters.environment}-tg`,
    });

    this.listener = this.alb.addListener('Listener', {
      port: props.parameters.alb.port,
      open: false,
    });

    this.listener.addAction('DefaultAction', {
      action: elbv2.ListenerAction.forward([this.targetGroup])
    });
  }
}