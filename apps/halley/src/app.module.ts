import {
  type GraphQLDataSourceProcessOptions,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
} from '@apollo/gateway';
import { GraphQLDataSourceRequestKind } from '@apollo/gateway/dist/datasources/types';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { Context, GraphQLModule } from '@nestjs/graphql';
import { SERVICE_PORTS } from 'constants/ports.constant';
import { APPLICATION_TOKEN } from 'constants/app.constant';
import type { IncomingMessage } from 'http';
import { METADATA_TOKEN } from 'constants/common.constant';

interface Context {
  req?: IncomingMessage;
}

class RouterDataSource extends RemoteGraphQLDataSource {
  willSendRequest({
    request,
    context,
    kind,
  }: GraphQLDataSourceProcessOptions<Context>) {
    if (kind !== GraphQLDataSourceRequestKind.INCOMING_OPERATION) return;

    const _authorization = context.req?.headers.authorization;
    if (_authorization) {
      request.http?.headers.set(METADATA_TOKEN.AUTHORIZATION, _authorization);
    }
  }
}

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,

      useFactory: () => {
        return {
          gateway: {
            supergraphSdl: new IntrospectAndCompose({
              subgraphs: [
                {
                  name: APPLICATION_TOKEN.MERCURY,
                  url: `http://localhost:${SERVICE_PORTS.MERCURY}/graphql`,
                },
                {
                  name: APPLICATION_TOKEN.VENUS,
                  url: `http://localhost:${SERVICE_PORTS.VENUS}/graphql`,
                },
                {
                  name: APPLICATION_TOKEN.EARTH,
                  url: `http://localhost:${SERVICE_PORTS.EARTH}/graphql`,
                },
                {
                  name: APPLICATION_TOKEN.MARS,
                  url: `http://localhost:${SERVICE_PORTS.MARS}/graphql`,
                },
                {
                  name: APPLICATION_TOKEN.JUPITER,
                  url: `http://localhost:${SERVICE_PORTS.JUPITER}/graphql`,
                },
              ],
            }),
            buildService: (definition) => {
              return new RouterDataSource(definition);
            },
          },
        };
      },
    }),
  ],
})
export class AppModule {}
