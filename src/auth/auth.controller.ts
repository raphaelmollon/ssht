import { Controller, Post, Session as GetSession, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthService } from './auth.service';
import { UserSession } from './session.type';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('signin')
    signin(
        @Body() body,
        @GetSession() session: UserSession
    ) {
        return this.authService.signin(body, session);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles('editor','reader','guest')
    @Post('signout')
    signout(@GetSession() session: UserSession) {
        return this.authService.signout(session);
    }

    @Public()
    @Post('signup')
    signup(@Body() body) {
        return this.authService.signup(body);
    }
}
