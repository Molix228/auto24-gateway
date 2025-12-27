import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClientConfig } from 'src/configs/kafka-client.factory';

@Module({
  imports: [
    AuthModule,
    ClientsModule.registerAsync([
      createKafkaClientConfig({
        name: 'USER_SERVICE',
        groupId: 'api-gateway-user-consumer',
      }),
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
