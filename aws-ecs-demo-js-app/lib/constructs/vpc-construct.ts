import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Parameters } from '../parameters';

export interface VpcConstructProps {
  readonly parameters: Parameters;
}

export class VpcConstruct extends Construct {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: VpcConstructProps) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, 'VPC', {
      ipAddresses: ec2.IpAddresses.cidr(props.parameters.vpc.cidr),
      maxAzs: props.parameters.vpc.maxAzs,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
      ],
    });
  }
}