// パラメータ用の型定義

export interface Parameters {
  readonly projectName: string;
  readonly environment: string;
  readonly aws: {
    readonly account: string;
    readonly region: string;
  };
  readonly vpc: {
    readonly cidr: string;
    readonly maxAzs: number;
  };
  readonly ecr: {
    readonly repositoryName: string;
  };
  readonly ecs: {
    readonly taskDefinitionArnSsmParameter: string;
    readonly containerName: string;
    readonly containerPort: number;
    readonly desiredCount: number;
  };
  readonly alb: {
    readonly port: number;
    readonly healthCheckPath: string;
  };
}
