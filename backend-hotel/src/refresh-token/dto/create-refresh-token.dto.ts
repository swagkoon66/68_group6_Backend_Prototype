export class CreateRefreshTokenDto {
    id!: string;
    userId!: string;
    tokenHash!: string;
    expiresAt!: Date;
    revokedAt!: Date;
}