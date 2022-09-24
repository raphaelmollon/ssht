import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const session = ctx.switchToHttp().getRequest().session;
        const user = session.user;

        return data ? user?.[data] : user;
    }
)
