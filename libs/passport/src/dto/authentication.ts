import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Authentication {
  @Field(() => String, {
    description: 'id',
  })
  id: string;
}
