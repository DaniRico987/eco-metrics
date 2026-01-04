import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Company } from '../../companies/models/company.model';

export enum MetricRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

registerEnumType(MetricRequestStatus, {
  name: 'MetricRequestStatus',
});

@ObjectType()
export class MetricRequest {
  @Field(() => ID)
  id: string;

  @Field()
  description: string;

  @Field(() => MetricRequestStatus)
  status: MetricRequestStatus;

  @Field({ nullable: true })
  adminNote?: string;

  @Field(() => Company)
  company: Company;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
