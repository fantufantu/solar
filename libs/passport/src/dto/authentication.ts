import { Field, Int } from '@nestjs/graphql';

export class Authentication {
  @Field(() => Int, {
    description: 'id',
  })
  id: number;
}
