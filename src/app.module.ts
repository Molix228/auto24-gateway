import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ListingModule } from './listing/listing.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      expandVariables: true,
    }),
    AuthModule,
    UploadModule,
    ListingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
