import { Server } from 'http';
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
    (context: Context, data?:string|Record<string, any>): any
}

// re-export
export { Context, Logger, CloudEventResponse } from './lib/context';
