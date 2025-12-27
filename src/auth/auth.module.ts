import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { createKafkaClientConfig } from 'src/configs/kafka-client.factory';

@Module({
  imports: [
    ClientsModule.registerAsync([
      createKafkaClientConfig({
        name: 'AUTH_SERVICE',
        groupId: 'api-gateway-auth-consumer',
      }),
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
