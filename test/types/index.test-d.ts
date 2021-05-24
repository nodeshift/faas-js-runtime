import { expectType } from 'tsd';

import { Server } from 'http';
import { start, Invokable, Context, LogLevel, InvokerOptions } from '../../index';
import { CloudEvent } from 'cloudevents';

const fn: Invokable = function(
  context: Context,
  cloudevent?: CloudEvent
) {
  return undefined;
};

const options: InvokerOptions = {
  logLevel: LogLevel.info,
  port: 8080
};

expectType<Promise<Server>>(start(fn, options));