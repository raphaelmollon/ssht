import { Controller, Post, Session as GetSession, Body, HttpCode, HttpStatus, Get, Res, Headers, Query } from '@nestjs/common';
import { Inactive } from 'src/decorators/inactive.decorator';
import { Public } from 'src/decorators/public.decorator';
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
        console.log("auth.controller.signin body", body);
        return this.authService.signin(body, session);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Inactive()
    @Post('signout')
    signout(@GetSession() session: UserSession) {
        return this.authService.signout(session);
    }

    @Public()
    @Post('signup')
    signup(@Body() body, @Headers() h) {
        console.log("host: ", h);
        return this.authService.signup(body, h);
    }

    @Inactive()
    @Get('profile')
    async getProfile(@GetSession() session: UserSession) {
        return await this.authService.getProfile(session);
    }

    @Public()
    @Get('activate')
    async activate(@Res() res, @Query() query) {
        console.log("query", query);
        if (query.id && query.unique) {
            const activation = await this.authService.activate(query.id, query.unique);
            console.log("activation=", activation);
            if (query.redirect)
                res.status(301).redirect(query.redirect);
        } else res.status(500).send("Error... Please contact the admin");
    }
}
