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
        private readonly roleService: RoleService) {}

    // SIGN IN ////////////////////////////////////////
    async signin(body: any, session: UserSession) {
        if (body.username && body.password) {
            let knownUser = await this.userService.findOneByUsername(body.username, true);
            if (knownUser && await bcrypt.compare(body.password, knownUser.password)) {
                await this.userService.refreshLastConnection(knownUser.id);
                delete knownUser.password;
                delete knownUser.salt;
                const role = knownUser.role;
                delete knownUser.role;
                return session.user = {...knownUser, role: role.name};
            } else
                throw new UnauthorizedException({
                    statusCode: 401,
                    msg: 'User unknown'
                }); 
        }
        throw new UnauthorizedException({
            statusCode: 401,
            msg: 'Username AND password are expected.'
        });
    }

    // SIGN OUT ///////////////////////////////////////
    async signout(session: UserSession) {
        const user = session.user;
        if (user === undefined)
            throw new NotFoundException({msg: "No session found.."});
        session.destroy((err) => {
            console.log("signing out user", user);
            if (err) throw new InternalServerErrorException({
                msg : "Error while deleting the session. Was anyone really connected?"
            });
            return "user logged out";
        });
    }

    // SIGN UP ////////////////////////////////////////
    async signup(body: any) {
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
                        msg: "This username (" + body.username + ") is already used"
                    });

                // mail?
                if (!body.email)
                    throw new NotAcceptableException({
                        msg: "An email address is required for resetting the password"
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
                return await this.userService.createUser(u);
            }
        }
        throw new NotAcceptableException({
            msg: 'A valid username AND password are expected.'
        });
    }
}
