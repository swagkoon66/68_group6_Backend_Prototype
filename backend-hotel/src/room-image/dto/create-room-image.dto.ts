export class CreateRoomImageDto {
    id!: string;
    roomId!: string;
    url!: string;
    storageKey?: string;
    mimeType?: string;
    fileSize?: number;
    isPrimary!: boolean;
    createdAt!: Date;
}
