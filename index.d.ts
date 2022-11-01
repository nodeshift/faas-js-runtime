import { Server } from 'http';
import { CloudEventFunction, HTTPFunction } from './lib/types';

// Invokable describes the function signature for a function that can be invoked by the server.
export type Invokable = CloudEventFunction | HTTPFunction;

// start starts the server for the given function.
export declare const start: {
  (func: Invokable, options?: InvokerOptions): Promise<Server>
}

// InvokerOptions allow the user to configure the server.
export type InvokerOptions = {
    'logLevel'?: LogLevel,
    'port'?: Number,
    'path'?: String
}

export enum LogLevel {
    'trace', 'debug', 'info', 'warn', 'error', 'fatal'
}

// re-export
export * from './lib/types';
