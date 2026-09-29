import { notification_type } from "@prisma/client";

export class CreateNotificationDto {
    id!:string;
    userId!: string;
    bookingId?: string;
    type!: notification_type;
    message!: string;
    isRead!: boolean;
    createdAt!: Date;
}
