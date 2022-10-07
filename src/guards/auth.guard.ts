import { CanActivate, ExecutionContext, Injectable, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_INACTIVE_KEY } from 'src/decorators/inactive.decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("testing AUTH for..", context.switchToHttp().getRequest().route.path);


    // IS IT A PUBLIC ROUTE?
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log("public?", !!isPublic);
    if (isPublic) return true;  // and we say ok


    // IS THE USER CONNECTED?
    const user = context.switchToHttp().getRequest().session.user;
    console.log("user?", !!user, user?user.username:"nobody");
    if (user) {
      // IS THE ROUTE INACTIVE USER'S FRIENDLY?
      const isInactive = this.reflector.getAllAndOverride<boolean>(IS_INACTIVE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      console.log("active?", user.active);
      if (isInactive) return true;  // user connected, but active stat required
    } else return false;  // no connected user

    // IS THE USER ROLE ACCEPTED?
    const roles = this.reflector.getAllAndMerge<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    roles.push('admin');  // admin is always authorized
    console.log("authorized:", roles);
    console.log("role", user.role);
    if (roles.length && !roles.includes(user.role)) return false;  // not the suitable role
    

    // EVERYTHING OK!!
    return true;  // ok
  }
}
