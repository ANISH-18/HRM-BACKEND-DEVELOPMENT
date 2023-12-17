import { Role } from "@helpers";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";





@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ])
        // if (!requiredRoles) {
        //     return true;
        //   }

          const {user} = context.switchToHttp().getRequest();

          return requiredRoles.some((role) => user?.emp_role?.includes(role));
    }
}