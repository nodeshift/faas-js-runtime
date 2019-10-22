# Function Specification

Functions invoked by this framework are expected to conform to a well-defined
contract. This document outlines the expectations for function writers, for
example, what the function signature should be. As well, it provides a pseudo
code API to which other runtime frameworks should conform.

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

In addition to invocation via incoming events, functions may be invoked
in response to any of the HTTP request types (eg GET, POST, PUT). However,
if the incoming request is HTTP POST and contains headers for a Cloud
Event, the incoming HTTP request is converted to a Cloud Event and provided
via the `Context` object.
