import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { KafkaHealthIndicator } from './kafka.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly kafka: KafkaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Проверка heap памяти (не более 150MB)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),

      // Проверка RSS памяти (не более 300MB)
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),

      // Проверка диска (не более 90% заполнено)
      () =>
        this.disk.checkStorage('disk', {
          path: '/',
          thresholdPercent: process.env.NODE_ENV === 'production' ? 0.85 : 0.95,
        }),

      // Проверка Kafka
      () => this.kafka.isHealthy('kafka-broker'),
    ]);
  }

  // Liveness probe - приложение работает
  @Get('live')
  liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  // Readiness probe - готово принимать трафик
  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([() => this.kafka.isHealthy('kafka')]);
  }
}
