import { SetMetadata } from "@nestjs/common";
import { user_role } from "@prisma/client";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: user_role[]) => SetMetadata(ROLES_KEY, roles);
export const PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_KEY, true);
