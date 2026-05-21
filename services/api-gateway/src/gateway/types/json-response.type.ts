import { Field, ObjectType } from '@nestjs/graphql';
import { JsonScalar } from '../../common/scalars/json.scalar';

@ObjectType()
export class JsonResponse {
  @Field(() => String)
  service: string;

  @Field(() => String)
  operation: string;

  @Field(() => String)
  status: string;

  @Field(() => String)
  requestedAt: string;

  @Field(() => JsonScalar)
  payload: unknown;
}
