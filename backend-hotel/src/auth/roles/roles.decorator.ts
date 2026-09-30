import { SetMetadata } from "@nestjs/common";
import { user_role } from "@prisma/client";

/* Same as in class lab */
// Declared for mapping 'user_role' from database
export const ROLES_KEY = 'roles';
export const Roles = (...roles: user_role[]) => SetMetadata(ROLES_KEY, roles);
