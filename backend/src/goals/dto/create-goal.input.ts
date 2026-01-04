import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateGoalInput {
  @Field()
  metricId: string;

  @Field(() => Float)
  target: number;

  @Field(() => Int)
  year: number;
}
