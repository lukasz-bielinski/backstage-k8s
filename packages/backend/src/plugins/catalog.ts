import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import AWS from 'aws-sdk';
import { AwsEKSClusterProcessor } from '@backstage/plugin-catalog-backend-module-aws';

export default async function createPlugin(
    env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  builder.addProcessor(
      new AwsEKSClusterProcessor({
        credentialsFactory: () =>
            new AWS.CredentialProviderChain().resolvePromise(),
      }),
  );

  const { processingEngine, router } = await builder.build();

  await processingEngine.start();
  return router;
}
