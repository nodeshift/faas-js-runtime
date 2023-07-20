import { IncomingHttpHeaders, IncomingMessage } from 'http';

import { expectAssignable, expectType } from 'tsd';
import { CloudEvent } from 'cloudevents';

import { Context, CloudEventResponse, Logger } from '../../index';

const context = {} as Context;

// Context
expectType<Context>(context);
expectType<CloudEventResponse>(context.cloudEventResponse('test-data'));
expectType<Logger>(context.log);
expectType<IncomingMessage>(context.req);
expectType<IncomingHttpHeaders>(context.headers);
expectType<Record<string, string> | undefined>(context.query);
expectType<string>(context.method);
expectType<string>(context.httpVersion);
expectType<number>(context.httpVersionMajor);
expectType<number>(context.httpVersionMinor);
expectType<CloudEvent<unknown>>(context.cloudevent);
expectAssignable<Record<string, unknown> | string | undefined>(context.body);
expectAssignable<string | undefined>(context.rawBody);

// CloudEventResponse
expectType<CloudEvent>(context.cloudEventResponse('').response());
expectType<CloudEventResponse>(context.cloudEventResponse('').id(''));
expectType<CloudEventResponse>(context.cloudEventResponse('').source(''));
expectType<CloudEventResponse>(context.cloudEventResponse('').type(''));
expectType<CloudEventResponse>(context.cloudEventResponse('').version(''));
