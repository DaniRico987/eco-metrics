import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateImpactRecordInput {
  @Field(() => Int)
  month: number;

  @Field(() => Int)
  year: number;

  @Field(() => Float)
  energyKwh: number;

  @Field(() => Float)
  waterM3: number;

  @Field(() => Float)
  wasteKg: number;

  @Field(() => Float)
  transportKm: number;
}
