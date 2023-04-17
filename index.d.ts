import { Server } from 'http';
import { CloudEventFunction, HTTPFunction, InvokerOptions } from './lib/types';

// Invokable describes the function signature for a function that can be invoked by the server.
export type Invokable = CloudEventFunction | HTTPFunction;

// start starts the server for the given function.
export declare const start: {
  // eslint-disable-next-line no-unused-vars
  (func: Invokable | Function, options?: InvokerOptions): Promise<Server>
};

// re-export
export * from './lib/types';
