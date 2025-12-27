import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaHealthIndicator {
  private kafka: Kafka;

  constructor(private readonly healthIndicatorService: HealthIndicatorService) {
    this.kafka = new Kafka({
      clientId: 'health-check',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      retry: {
        retries: 3,
        initialRetryTime: 100,
      },
    });
  }

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key);

    try {
      const admin = this.kafka.admin();
      await admin.connect();

      const topics = await admin.listTopics();

      await admin.disconnect();

      return indicator.up({
        message: 'Kafka is reachable',
        topics: topics.length,
      });
    } catch (error) {
      return indicator.down({
        message: error.message,
      });
    }
  }
}
