import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import AWS from 'aws-sdk';
import { AwsEKSClusterProcessor } from '@backstage/plugin-catalog-backend-module-aws';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();

  builder.addProcessor(
    new AwsEKSClusterProcessor({
      credentialsFactory: () =>
        new AWS.CredentialProviderChain().resolvePromise(),
    }),
  );
  await processingEngine.start();
  return router;
}
