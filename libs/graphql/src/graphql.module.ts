// nest
import { Module } from '@nestjs/common';
import { GraphQLModule as NativeGraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

@Module({
  imports: [
    // GraphQL 模块
    NativeGraphQLModule.forRoot<ApolloFederationDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloFederationDriver,
    }),
  ],
})
export class GraphQLModule {}
