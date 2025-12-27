import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ListingModule } from './listing/listing.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    HealthModule,
    AuthModule,
    UploadModule,
    ListingModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
