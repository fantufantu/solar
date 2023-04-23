import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ServicePort } from 'assets/ports';

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    const jwt = context.req?.headers.authorization;
    jwt && request.http.headers.set('Authorization', jwt);
  }
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'mercury',
              url: `http://localhost:${ServicePort.Mercury}/graphql`,
            },
            {
              name: 'venus',
              url: `http://localhost:${ServicePort.Venus}/graphql`,
            },
          ],
        }),
        buildService: (definition) => {
          return new AuthenticatedDataSource(definition);
        },
      },
    }),
  ],
})
export class AppModule {}
