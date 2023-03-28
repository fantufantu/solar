import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionBy {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
