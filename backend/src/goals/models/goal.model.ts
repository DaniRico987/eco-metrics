import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

import { Metric } from '../../metrics/entities/metric.entity';

@ObjectType()
export class Goal {
  @Field(() => ID)
  id: string;

  @Field()
  metricId: string;

  @Field(() => Metric)
  metric: Metric;

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
