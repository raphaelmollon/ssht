import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // if public page we don't have to check anything
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;  // and we say ok

    const user = context.switchToHttp().getRequest().session.user;
    console.log("user?", !!user);
    if (!user) return false;  // no connected user
    console.log("active?", user.active);
    if (!user.active) return false; // not active user
    console.log("role", user.role);
    // look at roles set to the route
    const roles = this.reflector.getAllAndMerge<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    roles.push('admin');  // admin is always authorized
    console.log("authorized:", roles);
    if (roles.length && !roles.includes(user.role)) return false;  // not the suitable role
    
    return true;  // ok
  }
}
