import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { Request } from 'express';
import { JsonResponse } from './types/json-response.type';

@Injectable()
export class GatewayService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async callService(
    serviceName: string,
    operation: string,
    config: AxiosRequestConfig,
    req: Request,
  ): Promise<JsonResponse> {
    const baseUrl = this.getServiceBaseUrl(serviceName);

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          ...config,
          baseURL: baseUrl,
          headers: {
            ...(config.headers ?? {}),
            ...this.getForwardedHeaders(req),
          },
        }),
      );

      return {
        service: serviceName,
        operation,
        status: 'success',
        requestedAt: new Date().toISOString(),
        payload: response.data,
      };
    } catch (error) {
      this.handleUpstreamError(error as AxiosError, serviceName, operation);
    }
  }

  private getForwardedHeaders(req: Request): Record<string, string> {
    const headers: Record<string, string> = {};
    if (typeof req.headers.authorization === 'string') {
      headers.authorization = req.headers.authorization;
    }
    return headers;
  }

  private getServiceBaseUrl(serviceName: string): string {
    const envKeyByService: Record<string, string> = {
      auth: 'AUTH_SERVICE_URL',
      vehicles: 'VEHICLE_SERVICE_URL',
      traffic: 'TRAFFIC_SERVICE_URL',
      incidents: 'INCIDENT_SERVICE_URL',
      notifications: 'NOTIFICATION_SERVICE_URL',
    };

    const envKey = envKeyByService[serviceName];
    if (!envKey) {
      throw new HttpException(`Unsupported service: ${serviceName}`, HttpStatus.BAD_REQUEST);
    }

    const baseUrl = this.configService.get<string>(envKey);
    if (!baseUrl) {
      throw new HttpException(
        `Missing configuration for ${envKey}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return baseUrl;
  }

  /**
   * Throws an HttpException derived from an upstream service failure.
   * This method never returns.
   */
  private handleUpstreamError(error: AxiosError, serviceName: string, operation: string): never {
    const status = error.response?.status ?? HttpStatus.BAD_GATEWAY;
    const data = error.response?.data;

    throw new HttpException(
      {
        message: `Upstream ${serviceName} service failed during ${operation}`,
        service: serviceName,
        operation,
        upstreamStatus: status,
        upstreamError: data,
      },
      status,
    );
  }
}
