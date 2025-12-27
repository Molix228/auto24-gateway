import { ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

interface KafkaClientConfig {
  name: string;
  groupId: string;
}

export const createKafkaClientConfig = (
  config: KafkaClientConfig,
): ClientsProviderAsyncOptions => ({
  name: config.name,
  useFactory: (configService: ConfigService) => ({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `${config.name.toLowerCase()}-client`,
        brokers: [configService.get<string>('KAFKA_BROKER') || ''],
        connectionTimeout: 5000,
        requestTimeout: 25000,
      },
      consumer: {
        groupId: config.groupId,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  }),
  inject: [ConfigService],
});
