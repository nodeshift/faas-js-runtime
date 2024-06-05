/* eslint-disable no-unused-vars */
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { CloudEvent } from 'cloudevents';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';

/**
 * The Function interface describes a Function project, including the handler function
 * as well as the initialization and shutdown functions, and health checks.
 */
export interface Function {
  // The initialization function, called before the server is started
  // This function is optional.
  init?: () => (any | Promise<any>);

  // The shutdown function, called after the server is stopped
  // This function is optional.
  shutdown?: () => (any | Promise<any>);

  // Function that returns an array of CORS origins
  // This function is optional.
  cors?: () => string[];

  // The liveness function, called to check if the server is alive
  // This function is optional and should return 200/OK if the server is alive.
  liveness?: HealthCheck;

  // The readiness function, called to check if the server is ready to accept requests
  // This function is optional and should return 200/OK if the server is ready.
  readiness?: HealthCheck;

  logLevel?: LogLevel;

  // The function to handle HTTP requests
  handle: CloudEventFunction | HTTPFunction;
}

/**
 * The HealthCheck interface describes a health check function,
 * including the optional path to which it should be bound.
 */
export interface HealthCheck {
  (request: Http2ServerRequest, reply: Http2ServerResponse): any;
  path?: string;
}

// InvokerOptions allow the user to configure the server.
export type InvokerOptions = {
  'logLevel'?: LogLevel,
  'port'?: Number,
  'path'?: String,
  'includeRaw'?: Boolean,
}

/**
 * Log level options for the server.
 */
export enum LogLevel {
  'trace', 'debug', 'info', 'warn', 'error', 'fatal'
}

/**
 * CloudEventFunction describes the function signature for a function that accepts CloudEvents.
 */
export interface CloudEventFunction<I = never, R = unknown> {
  (context: Context, event?: CloudEvent<I>): CloudEventFunctionReturn<R>;
}

// CloudEventFunctionReturn is the return type for a CloudEventFunction.
export type CloudEventFunctionReturn<T=unknown> = Promise<CloudEvent<T>> | CloudEvent<T> | HTTPFunctionReturn;

/**
 * HTTPFunction describes the function signature for a function that handles
 * raw HTTP requests.
 */
export interface HTTPFunction {
  (context: Context, body?: IncomingBody): HTTPFunctionReturn;
}

// IncomingBody is the union of all possible incoming body types for HTTPFunction invocations
export type IncomingBody = string | object | Buffer;

// HTTPFunctionReturn is the return type for an HTTP Function.
export type HTTPFunctionReturn = Promise<StructuredReturn> | StructuredReturn | ResponseBody | void;

// Union of the possible return types
export type FunctionReturn = CloudEventFunctionReturn | HTTPFunctionReturn;

// StructuredReturn is the type of the return value of an HTTP function.
export interface StructuredReturn {
  statusCode?: number;
  headers?: Record<string, string>;
  body?: ResponseBody;
}

// ResponseBody is the union of all possible response body types
export type ResponseBody = string | object | Buffer;

// Context is the request context for HTTP and CloudEvent functions.
export interface Context {
  log: Logger;
  req: IncomingMessage;
  query?: Record<string, any>;
  body?: Record<string, any> | string;
  rawBody?: string;
  method: string;
  headers: IncomingHttpHeaders;
  httpVersion: string;
  httpVersionMajor: number;
  httpVersionMinor: number;
  cloudevent: CloudEvent<unknown>;
  cloudEventResponse(data: string | object): CloudEventResponse;
}

export interface Logger {
  debug: (msg: any) => void,
  info:  (msg: any) => void,
  warn:  (msg: any) => void,
  error: (msg: any) => void,
  fatal: (msg: any) => void,
  trace: (msg: any) => void,
}

export interface CloudEventResponse {
  id(id: string): CloudEventResponse;
  source(source: string): CloudEventResponse;
  type(type: string): CloudEventResponse;
  version(version: string): CloudEventResponse;
  response(): CloudEvent;
}
