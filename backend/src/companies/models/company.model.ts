import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { CompanyMetric } from './company-metric.model';

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
  isConfigured: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [CompanyMetric], { nullable: true })
  companyMetrics?: CompanyMetric[];
}
