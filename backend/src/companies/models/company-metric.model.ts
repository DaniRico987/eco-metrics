import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Metric } from '../../metrics/entities/metric.entity';

@ObjectType()
export class CompanyMetric {
  @Field(() => ID)
  id: string;

  @Field()
  metricId: string;

  @Field(() => Metric)
  metric: Metric;

  @Field()
  isActive: boolean;
}
