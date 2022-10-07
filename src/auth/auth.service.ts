import { MailService } from './../mail/mail.service';
import { Injectable, NotFoundException, NotAcceptableException, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { UserSession } from './session.type';
import * as bcrypt from 'bcrypt';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly mailService: MailService) {}

    // SIGN IN ////////////////////////////////////////
    async signin(body: any, session: UserSession) {
        console.log("auth.service.signin body", body);

        if (body.username && body.password) {
            let knownUser = await this.userService.findOneByUsername(body.username, true);
            if (knownUser && await bcrypt.compare(body.password, knownUser.password)) {
                await this.userService.refreshLastConnection(knownUser.id);
                delete knownUser.password;
                delete knownUser.salt;
                const role = knownUser.role;
                delete knownUser.role;
                console.log("auth.service.signin found matching user", knownUser.username);
                // return session.user = {...knownUser, role: role.name};
                session.user = {...knownUser, role: role.name};
                return session;
            } else {
                console.log("auth.service.signin doesn't match", knownUser?knownUser.username:body.username);
                throw new UnauthorizedException({
                    statusCode: 401,
                    msg: ['User unknown']
                }); 
            }
        }
        throw new UnauthorizedException({
            statusCode: 401,
            msg: ['Username AND password are expected.']
        });
    }

    // SIGN OUT ///////////////////////////////////////
    async signout(session: UserSession) {
        const user = session.user;
        if (user === undefined)
            throw new NotFoundException({msg: ["No session found.."] });
        session.destroy((err) => {
            console.log("signing out user", user);
            if (err) throw new InternalServerErrorException({
                msg: ["Error while deleting the session. Was anyone really connected?"]
            });
            return "user logged out";
        });
    }

    // SIGN UP ////////////////////////////////////////
    async signup(body: any, h:any) {
        // at least the necessary
        if (body.username && body.password) {
            // is password already encrypted by frontend?
            if (body.alreadyEncrypted) {

            } else {
                // available username
                //const existingUser = await this.userService.findOneByUsername(body.username);
                //console.log("existingUser", existingUser);
                if (await this.userService.findOneByUsername(body.username))
                    throw new ConflictException({
                        msg: ["This username (" + body.username + ") is already used"]
                    });

                // mail?
                if (!body.email)
                    throw new NotAcceptableException({
                        msg: ["An email address is required for resetting the password"]
                    });
                
                // correct password
                let pwd:string = body.password;
                let errors:string[] = [];
                if (pwd.length < 8) errors.push("Password length must be at least 8");
                if (!pwd.match(/[a-z]/)) errors.push("Password must contain at least one lowercase character");
                if (!pwd.match(/[A-Z]/)) errors.push("Password must contain at least one uppercase character");
                if (!pwd.match(/[0-9]/)) errors.push("Password must contain at least one numeric character");
                if (!pwd.match(/[\&\"\#\'\{\(\[\]\)\}\|\_\\\@\=\+\°\$\£\%\!\§\:\/\;\.\,\?\<\>\*-]/)) 
                    errors.push("Password must contain at least one special character in the "+
                        "following list: &\"#'{([])}|_@=+°$£%!§:/;.,?<>*-");
                if (errors.length > 0)
                    throw new NotAcceptableException({
                        msg: errors
                    });
                const salt = await bcrypt.genSalt();
                pwd = await bcrypt.hash(pwd, salt);


                // try to register
                let u = new User();
                // get default role
                u.role = await this.roleService.findRoleByName('guest');
                u.username = body.username;
                u.password = pwd;
                u.salt =  salt;
                u.email = body.email;
                u.active = false;
                u.cdate = new Date();
                u.cuser = body.username;
//                return await this.userService.createOne(u);
                let registeredUser = await this.userService.createUser(u);

                // send the activation mail
                if (body.successfulActivatedUrl)
                    await this.mailService.sendUserActivation("http://"+h.host, registeredUser, body.successfulActivatedUrl, 
                        registeredUser.salt.replace(/[\.\/]/, ""));
                else console.log("No email provided...");

                delete registeredUser.salt;
                delete registeredUser.password;
                return registeredUser;
            }
        }
        throw new NotAcceptableException({
            msg: ['A valid username AND password are expected.']
        });
    }

    // PROFILE ///////////////////////////////////////
    async getProfile(session: UserSession) {
        const user = session.user;
        if (user === undefined)
            throw new NotFoundException({ msg: ["No session found.."] });
        console.log("fetching user information for", user.username);
        const res = await this.userService.findOneById(user.id, true);
        delete res.salt;
        delete res.password;
        console.log(res);
        return res;
    }

    // ACTIVATE //////////////////////////////////////
    async activate(id: number, salt: string) {
        const user = await this.userService.findOneById(id);
        if (user && user.salt.replace(/[\.\/]/, "") == salt) {
            return await this.userService.activate(id);
        }
    }

}
