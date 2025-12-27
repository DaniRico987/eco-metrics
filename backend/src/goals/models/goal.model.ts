import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  Float,
  Int,
} from '@nestjs/graphql';

export enum GoalCategory {
  ENERGY = 'ENERGY',
  WATER = 'WATER',
  WASTE = 'WASTE',
  TRANSPORT = 'TRANSPORT',
}

registerEnumType(GoalCategory, {
  name: 'GoalCategory',
});

@ObjectType()
export class Goal {
  @Field(() => ID)
  id: string;

  @Field(() => GoalCategory)
  category: GoalCategory;

  @Field(() => Float)
  target: number;

  @Field(() => Int)
  year: number;

  @Field()
  companyId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
