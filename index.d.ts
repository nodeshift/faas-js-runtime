import { Server } from 'http';
import { CloudEvent } from 'cloudevents';
import { Context } from './lib/context';

export declare const start: {
  (func: Invokable, options?: InvokerOptions): Promise<Server>
}

export type InvokerOptions = {
    'logLevel'?: LogLevel,
    'port'?: Number,
    'path'?: String
}

export enum LogLevel {
    'trace', 'debug', 'info', 'warn', 'error', 'fatal'
}

export interface Invokable {
    (context: Context, cloudevent?: CloudEvent<any>): any
}

// re-export
export { Context, Logger, CloudEventResponse } from './lib/context';
