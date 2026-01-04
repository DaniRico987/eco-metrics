import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class MetricValueInput {
  @Field()
  metricId: string;

  @Field(() => Float)
  amount: number;
}

@InputType()
export class CreateImpactRecordInput {
  @Field(() => Int)
  month: number;

  @Field(() => Int)
  year: number;

  @Field(() => [MetricValueInput])
  values: MetricValueInput[];
}
