/* eslint-disable no-unused-vars */
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { CloudEvent } from 'cloudevents';

/**
 * CloudEventFunction describes the function signature for a function that accepts CloudEvents.
 */
 export interface CloudEventFunction {
  (context: Context, event: CloudEvent): CloudEventFunctionReturn;
}

// CloudEventFunctionReturn is the return type for a CloudEventFunction.
export type CloudEventFunctionReturn = Promise<CloudEvent> | CloudEvent | HTTPFunctionReturn;

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
    body?: Record<string, any>|string;
    method: string;
    headers: IncomingHttpHeaders;
    httpVersion: string;
    httpVersionMajor: number;
    httpVersionMinor: number;
    cloudevent: CloudEvent;
    cloudEventResponse(data: string|object): CloudEventResponse;
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
