import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Company {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  sector: string;

  @Field(() => Int)
  employeesCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
