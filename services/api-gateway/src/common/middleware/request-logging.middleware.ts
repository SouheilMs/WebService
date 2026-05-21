import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('GatewayRequestLogger');

  use(req: Request, res: Response, next: NextFunction): void {
    const startedAt = Date.now();
    const operationName =
      typeof req.body?.operationName === 'string' ? req.body.operationName : 'anonymous';
    const requestId =
      typeof req.headers['x-request-id'] === 'string' ? req.headers['x-request-id'] : 'n/a';
    const forwardedFor = req.headers['x-forwarded-for'];
    const forwardedIp =
      typeof forwardedFor === 'string' ? forwardedFor.split(',')[0]?.trim() : undefined;
    const ip = forwardedIp || req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] ?? 'unknown';

    res.on('finish', () => {
      const durationMs = Date.now() - startedAt;
      this.logger.log(
        `${req.method} ${req.originalUrl} op=${operationName} requestId=${requestId} ip=${ip} ua=\"${userAgent}\" status=${res.statusCode} duration=${durationMs}ms`,
      );
    });

    next();
  }
}
