import { expectType } from 'tsd';

import { Server } from 'http';
import { start, Invokable, Context, LogLevel, InvokerOptions } from '../../index';
import { CloudEvent } from 'cloudevents';

const fn: Invokable = function(
  context: Context,
  cloudevent?: CloudEvent<unknown>
) {
  expectType<Context>(context);
  expectType<CloudEvent<unknown>|undefined>(cloudevent);
  return undefined;
};

const options: InvokerOptions = {
  logLevel: LogLevel.info,
  port: 8080,
  includeRaw: true,
  path: './'
};

expectType<Promise<Server>>(start(fn, options));
