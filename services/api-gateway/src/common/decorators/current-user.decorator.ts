import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticatedUser } from '../types/authenticated-user.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser | undefined => {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext<{ req: { user?: AuthenticatedUser } }>().req.user;
  },
);
