import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/* Empty because of the "passport" already implements the logic of "CanActivate" already */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') /*implements CanActivate*/ {
}