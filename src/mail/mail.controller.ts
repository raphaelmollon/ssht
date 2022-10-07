import { ConfigService } from '@nestjs/config';
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'src/user/user.entity';
import { MailService } from './mail.service';

@ApiTags('mail')
@Public()
@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Post('activation')
    async sendActivationMail(@Body() body: any) {
        let u = new User();
        u.email = body.email;
        u.username = body.username;
        u.id = 1;
        let url = body.successfulActivatedUrl;
        let salt = "TESTTESTTEST";
        return await this.mailService.sendUserActivation("http://localhost:3000", u, url, salt);
    }
}
