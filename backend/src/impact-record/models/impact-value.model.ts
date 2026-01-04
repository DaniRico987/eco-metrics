import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import { Metric } from '../../metrics/entities/metric.entity';

@ObjectType()
export class ImpactValue {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  co2Equivalent: number;

  @Field()
  metricId: string;

  @Field(() => Metric)
  metric: Metric;
}
