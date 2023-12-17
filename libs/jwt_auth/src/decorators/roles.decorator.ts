import { Role } from "@helpers";
import { SetMetadata } from "@nestjs/common";


export const hasRoles = (...roles: Role[]) => SetMetadata('roles', roles)