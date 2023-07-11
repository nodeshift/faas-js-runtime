import { Server } from 'http';
import { CloudEventFunction, HTTPFunction, InvokerOptions } from './lib/types';
import { LogLevel } from 'fastify';

// Invokable describes the function signature for a function that can be invoked by the server.
export type Invokable = CloudEventFunction | HTTPFunction;

export interface Config {
  logLevel: LogLevel;
  port: number;
  includeRaw: boolean;
}

// start starts the server for the given function.
export declare const start: {
  // eslint-disable-next-line no-unused-vars
  (func: Invokable | Function, options?: InvokerOptions): Promise<Server>
};

export declare const defaults: {
  LOG_LEVEL: LogLevel,
  PORT: number,
  INCLUDE_RAW: boolean,
}

// re-export
export * from './lib/types';
