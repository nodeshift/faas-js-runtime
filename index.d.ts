import { Server } from 'http';
import { CloudEvent } from 'cloudevents';
import { Context } from './lib/context';

export declare const start: {
  (func: Invokable, options: InvokerOptions): Promise<Server>
}

export type InvokerOptions = {
    'logLevel': LogLevel,
    'port': Number
}

export enum LogLevel {
    'debug', 'info', 'warn', 'error'
}

export interface Invokable {
    (context: Context, cloudevent?: CloudEvent): any
}

// re-export
export { Context, Logger, CloudEventResponse } from './lib/context';
