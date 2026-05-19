import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface ServiceEvent<TPayload> {
  name: string;
  payload: TPayload;
}

@Injectable()
export class EventBusService {
  private readonly stream = new Subject<ServiceEvent<unknown>>();

  emit<TPayload>(name: string, payload: TPayload): void {
    this.stream.next({ name, payload });
  }

  on<TPayload>(name: string): Observable<TPayload> {
    return this.stream.asObservable().pipe(
      filter((event): event is ServiceEvent<TPayload> => event.name === name),
      map((event) => event.payload),
    );
  }
}
