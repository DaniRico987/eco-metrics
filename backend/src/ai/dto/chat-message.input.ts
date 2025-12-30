import { InputType, Field } from '@nestjs/graphql';
import type { AiRole } from '../ai.service';

@InputType()
export class ChatMessageInput {
  @Field()
  role: AiRole;

  @Field()
  content: string;
}
