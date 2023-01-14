import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { AccountBook } from '../../account-book/entities/account-book.entity';

@ObjectType()
@Entity()
export class UserProfile {
  @PrimaryColumn()
  userId: number;

  @Column({
    nullable: true,
  })
  defaultAccountBookId?: number;

  @Field(() => AccountBook, {
    nullable: true,
    description: '默认账本',
  })
  @ManyToOne(() => AccountBook, {
    nullable: true,
  })
  defaultAccountBook?: AccountBook;
}
