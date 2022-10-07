import { User } from 'src/user/user.entity';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserActivation(host: string, user: User, url: string, salt: string) {
        console.log("user", user, "redirectTo", url, "salt", salt);
        const builtUrl = host + "/auth/activate/?id=" + user.id + "&unique=" + salt + "&redirect=" + url;
        console.log("builtUrl=", builtUrl);
        return await this.mailerService.sendMail({
            to: user.email,
            // from: 'override default from'
            subject: 'Welcome to SSHT! Confirm your email',
            template: './activation',
            context: {
                username: user.username,
                url: builtUrl,
            },
        });
    }
}
