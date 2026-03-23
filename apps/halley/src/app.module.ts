import {
  type GraphQLDataSourceProcessOptions,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
} from '@apollo/gateway';
import { GraphQLDataSourceRequestKind } from '@apollo/gateway/dist/datasources/types';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { Context, GraphQLModule } from '@nestjs/graphql';
import { SERVICE_PORTS } from 'constants/ports';
import { ApplicationToken } from 'assets/tokens';
import type { IncomingMessage } from 'http';

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
      request.http?.headers.set('Authorization', _authorization);
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
                  name: ApplicationToken.Mercury,
                  url: `http://localhost:${SERVICE_PORTS.MERCURY}/graphql`,
                },
                {
                  name: ApplicationToken.Venus,
                  url: `http://localhost:${SERVICE_PORTS.VENUS}/graphql`,
                },
                {
                  name: ApplicationToken.Earth,
                  url: `http://localhost:${SERVICE_PORTS.EARTH}/graphql`,
                },
                {
                  name: ApplicationToken.Mars,
                  url: `http://localhost:${SERVICE_PORTS.MARS}/graphql`,
                },
                {
                  name: ApplicationToken.Jupiter,
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
