import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAccountBookInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
