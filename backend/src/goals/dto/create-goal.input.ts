import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { GoalCategory } from '../models/goal.model';

@InputType()
export class CreateGoalInput {
  @Field(() => GoalCategory)
  category: GoalCategory;

  @Field(() => Float)
  target: number;

  @Field(() => Int)
  year: number;
}
