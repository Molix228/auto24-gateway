import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'auth-service-client',
                brokers: [configService.get<string>('KAFKA_BROKER') || ''],
                connectionTimeout: 5000,
                requestTimeout: 25000,
              },
              consumer: {
                groupId: 'api-gateway-auth-consumer',
                sessionTimeout: 30000,
                heartbeatInterval: 3000,
              },
              producer: {
                createPartitioner: Partitioners.LegacyPartitioner,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
