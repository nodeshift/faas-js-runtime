# Function Specification

Functions invoked by this framework are expected to conform to a well-defined
contract. This document outlines the function signature that function developers
must conform to as well as an outline for an API that function developers can
use to receive and respond to events, subscribe to channels(?), and query the
state of the system(?). The API and function signature are provided here in
JavaScript, but consideration is given to the fact that there will be other
function frameworks with different language constructs. (note: should we just
do this in UML?)


## Function Signature

A function should accept some form of `Context` object. Depending on the language,
this may be an object in the classical object oriented programming sense, or it may
just be a struct or some other representation of a thing which holds a bunch of
properties and which can perform some functions on behalf of the user, for example,
send a response to an incoming message.

A function may be either synchronous or asynchronous and for most runtimes,
this will have an affect on the function signature. For synchronous functions,
the return value can be any valid type for the runtime. For asynchronous
functions, the return value should be a form of `Promise` or `Future` or other
language construct that represents a future value or error condition.

### Asynchronous JavaScript Function Example

```js
const decoder = import('image-decoder');

module.exports = async function processSavedImage(context) {
  return new Promise((resolve, reject) => {
    try {
      const image = await decoder(context.cloudevent.message);
      // process the image
      resolve({
        message: `Image ${image.id} processed`
      });
    } catch(err) {
      reject(err)
    }
  });
};
```

## Runtime environment

TODO: Specify environment variables

## The `Context` Object

The `Context` object is the function programmer's primary interface with the runtime
framework. This object should contain properties that represent the relevant data
for a given event. Some common properties for discussion are below.

  * Timestamp for the event
  * Event source name
  * Event source type
  * Data input - a object, string or stream
  * Data output - a object, string or stream

## Error Handling

Asynchronous functions should propogate errors through the returned future. For
example, in Java when `Future#get()` is called, an Exception should be thrown.
In JavaScript, the `Promise` should be rejected.

TODO: Define common error messages/codes/types

## Cloud Events

The function developer should be able to declaratively specify input sources
which manifest in the Knative Eventing system as a Cloud Event.

## HTTP as Event Source and Output Channel

In addition to invocation via incoming events, functions may
 be invoked
in response to any of the HTTP request types (eg GET, POST, PUT). However,
if the incoming request is HTTP POST and contains headers for a Cloud
Event, the incoming HTTP request is converted to a Cloud Event and provided
via the `Context` object.
