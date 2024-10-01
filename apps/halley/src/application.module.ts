import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ServicePort } from 'assets/ports';
import { ApplicationToken } from 'assets/tokens';

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    const jwt = context.req?.headers.authorization;
    jwt && request.http.headers.set('Authorization', jwt);
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
                  url: `http://localhost:${ServicePort.Mercury}/graphql`,
                },
                {
                  name: ApplicationToken.Venus,
                  url: `http://localhost:${ServicePort.Venus}/graphql`,
                },
                {
                  name: ApplicationToken.Earth,
                  url: `http://localhost:${ServicePort.Earth}/graphql`,
                },
              ],
            }),
            buildService: (definition) => {
              return new AuthenticatedDataSource(definition);
            },
          },
        };
      },
    }),
  ],
})
export class ApplicationModule {}
