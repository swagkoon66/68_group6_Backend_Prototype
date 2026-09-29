import { user_role } from "@prisma/client";
import { CreateBookingDto } from "../../booking/dto/create-booking.dto";
import { CreateNotificationDto } from "../../notification/dto/create-notification.dto";
import { CreateRefreshTokenDto } from "../../refresh-token/dto/create-refresh-token.dto";

export class CreateUserDto {
    id!: string;
    name!: string;
    email!: string;
    passwordHash!: string;
    role!: user_role;
    isActive!: boolean | true;
    createdAt!: Date;
    updatedAt!: Date;
    booking?: CreateBookingDto[];
    notification?: CreateNotificationDto[];
    refreshToken?: CreateRefreshTokenDto[];
}
