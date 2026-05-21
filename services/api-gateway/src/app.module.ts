import { join } from 'path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { RequestLoggingMiddleware } from './common/middleware/request-logging.middleware';
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard';
import { GatewayResolver } from './gateway/gateway.resolver';
import { GatewayService } from './gateway/gateway.service';
import { JsonScalar } from './common/scalars/json.scalar';
import { HealthController } from './health/health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('RATE_LIMIT_TTL', 60) * 1000,
          limit: configService.get<number>('RATE_LIMIT_LIMIT', 100),
        },
      ],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        introspection: true,
        playground: configService.get<string>('GRAPHQL_PLAYGROUND', 'true') !== 'false',
        context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
        formatError: (formattedError: GraphQLFormattedError, error: GraphQLError) => ({
          message: formattedError.message,
          code: error.extensions?.code ?? 'INTERNAL_SERVER_ERROR',
          path: formattedError.path,
          timestamp: new Date().toISOString(),
        }),
      }),
    }),
  ],
  providers: [
    GatewayResolver,
    GatewayService,
    JsonScalar,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
