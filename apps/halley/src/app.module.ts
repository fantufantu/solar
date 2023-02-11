import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ServicePort } from 'assets/ports';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        cors: true,
      },
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
      },
    }),
  ],
})
export class AppModule {}
