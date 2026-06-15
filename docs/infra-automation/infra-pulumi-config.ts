# Pulumi Infrastructure Config

```typescript
import * as aws from '@pulumi/aws';

const cluster = new aws.ecs.Cluster('remotedesk', {});

const service = new aws.ecs.Service('api', {
  cluster: cluster.id,
  desiredCount: 3,
  launchType: 'FARGATE',
});
```
