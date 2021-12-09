# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.8.0](https://www.github.com/boson-project/faas-js-runtime/compare/v0.7.1...v0.8.0) (2021-12-09)


### Features

* add an endpoint for prometheus at /metrics ([#109](https://www.github.com/boson-project/faas-js-runtime/issues/109)) ([559c110](https://www.github.com/boson-project/faas-js-runtime/commit/559c11039bd7a9fbb505fb7689b58c079ce240c4))
* add limited support for func.yaml via logLevel ([#104](https://www.github.com/boson-project/faas-js-runtime/issues/104)) ([6e376fa](https://www.github.com/boson-project/faas-js-runtime/commit/6e376fa508bd4201c085c5adb8acec880437a91a))


### Bug Fixes

* use cloudevent as second param in test fn ([#99](https://www.github.com/boson-project/faas-js-runtime/issues/99)) ([d3dae1d](https://www.github.com/boson-project/faas-js-runtime/commit/d3dae1dee78d9466595c828a169ff964434d28a6))

### [0.7.1](https://www.github.com/boson-project/faas-js-runtime/compare/v0.7.0...v0.7.1) (2021-05-24)


### Bug Fixes

* fix Invokable type signature ([#97](https://www.github.com/boson-project/faas-js-runtime/issues/97)) ([2c7f66c](https://www.github.com/boson-project/faas-js-runtime/commit/2c7f66c57767d459749c7a543cd06ee0cd76983a))

## [0.7.0](https://www.github.com/boson-project/faas-js-runtime/compare/v0.6.0...v0.7.0) (2021-05-24)


### Features

* add TypeScript type definitions ([#90](https://www.github.com/boson-project/faas-js-runtime/issues/90)) ([d43fa28](https://www.github.com/boson-project/faas-js-runtime/commit/d43fa28c0114ed7ef24a805f43c50b19cfe7a287))
* **cli:** pass --logLevel and --port from the cli or as env variables ([d6b32a3](https://www.github.com/boson-project/faas-js-runtime/commit/d6b32a3e32292112c531abe63d5ffbad9c00639e))


### Bug Fixes

* change index.js to not have a default export ([#93](https://www.github.com/boson-project/faas-js-runtime/issues/93)) ([d5bfd68](https://www.github.com/boson-project/faas-js-runtime/commit/d5bfd68f4ee731f6a7170ff8978954ff8fd0c100))

## [0.6.0](https://www.github.com/boson-project/faas-js-runtime/compare/v0.5.1...v0.6.0) (2021-04-10)


### Features

* support configurable log levels ([#82](https://www.github.com/boson-project/faas-js-runtime/issues/82)) ([b6f8be4](https://www.github.com/boson-project/faas-js-runtime/commit/b6f8be4f9e671e2c8be7f85e104400d52219e5ff))


### Bug Fixes

* better error handling when network address is already in use ([#74](https://www.github.com/boson-project/faas-js-runtime/issues/74)) ([ae28dcf](https://www.github.com/boson-project/faas-js-runtime/commit/ae28dcfed94dc50fe89a67a1262e78b59c7cbd0a))

### [0.5.1](https://www.github.com/boson-project/faas-js-runtime/compare/v0.5.0...v0.5.1) (2020-11-03)


### Bug Fixes

* reverse the parameter order when invoking ([#71](https://www.github.com/boson-project/faas-js-runtime/issues/71)) ([df55e8a](https://www.github.com/boson-project/faas-js-runtime/commit/df55e8a9fe4e3f97cb1e82f2d6da6f5d82ec936b))

## [0.5.0](https://www.github.com/boson-project/faas-js-runtime/compare/v0.4.0...v0.5.0) (2020-10-30)


### Features

* handle CloudEvent and Message responses from function invocation ([#68](https://www.github.com/boson-project/faas-js-runtime/issues/68)) ([351197f](https://www.github.com/boson-project/faas-js-runtime/commit/351197f7258e8612fc4ad1a1d43d3952ba87f7f6))


### Bug Fixes

* handle cloudevents that have no data ([#67](https://www.github.com/boson-project/faas-js-runtime/issues/67)) ([84d402d](https://www.github.com/boson-project/faas-js-runtime/commit/84d402d32301ce379f819b670deb7348cc2a7d1b))

## [0.4.0](https://www.github.com/boson-project/faas-js-runtime/compare/v0.3.0...v0.4.0) (2020-10-06)


### Features

* provide cloudevent data if it exists as first parameter to function ([#61](https://www.github.com/boson-project/faas-js-runtime/issues/61)) ([cdd4d8b](https://www.github.com/boson-project/faas-js-runtime/commit/cdd4d8ba4258a95a1344de90a5940bc629f6cf00))

## [0.3.0](https://www.github.com/boson-project/faas-js-runtime/compare/v0.2.3...v0.3.0) (2020-10-01)


### Features

* change module name to faas-js-runtime ([#56](https://www.github.com/boson-project/faas-js-runtime/issues/56)) ([304eba6](https://www.github.com/boson-project/faas-js-runtime/commit/304eba608ec3a7c45069ed3092dfb3af13c2456a))


### Bug Fixes

* remove openwhisk varaiables from context ([#57](https://www.github.com/boson-project/faas-js-runtime/issues/57)) ([bb07696](https://www.github.com/boson-project/faas-js-runtime/commit/bb076960a6a87afec828336ce5e7e19e92cfc7c6))

### [0.2.3](https://github.com/openshift-cloud-functions/faas-js-runtime/compare/v0.2.2...v0.2.3) (2020-09-04)

### [0.2.2](https://github.com/openshift-cloud-functions/faas-js-runtime/compare/v0.2.1...v0.2.2) (2020-09-02)

### [0.2.1](https://github.com/openshift-cloud-functions/faas-js-runtime/compare/v0.2.0...v0.2.1) (2020-08-12)

## [0.2.0](https://github.com/openshift-cloud-functions/faas-js-runtime/compare/v0.1.0...v0.2.0) (2020-02-12)


### Features

* add support for 1.0 structured cloud events ([#24](https://github.com/openshift-cloud-functions/faas-js-runtime/issues/24)) ([b246948](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/b24694827ff0de4ebbbf3977cd7ab9fbf6e14391))
* provide structured logger to functions in context ([#28](https://github.com/openshift-cloud-functions/faas-js-runtime/issues/28)) ([0bec8df](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/0bec8df02425719f0dc5ad974164bee8393d3a9e))


### Bug Fixes

* **README:** update sample to use correct namespaced module ([#26](https://github.com/openshift-cloud-functions/faas-js-runtime/issues/26)) ([293e557](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/293e55747ed0ee92b0ea241a29946bab0fdb24ec))

## [0.1.0](https://github.com/openshift-cloud-functions/faas-js-runtime/compare/v0.0.4...v0.1.0) (2019-12-13)


### Features

* add support for cloud events version 1.0 ([#21](https://github.com/openshift-cloud-functions/faas-js-runtime/issues/21)) ([f282e28](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/f282e28b2927156380b3c408dd156575ad30a3ea))

### [0.0.4](https://github.com/openshift-cloud-functions/faas-js-runtime/compare/v0.0.3...v0.0.4) (2019-11-12)


### Features

* use error code and message for thrown exceptions ([d1cce37](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/d1cce3728c7edc12465ba1d03cdfb5c84f03ba60))

### [0.0.3](https://github.com/openshift-cloud-functions/faas-js-runtime/compare/v0.0.2...v0.0.3) (2019-11-08)


### Features

* add openwhisk private properties to context object ([6bea65e](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/6bea65e8bd4921877fd2c2f9e824ee5be9700abc))
* add query parameters to context object ([74eb5b8](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/74eb5b8e7fca20bce3a3cbc6c8aabcbd4bbe3e99))
* allow function to set headers ([abff9dc](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/abff9dcf65c40b42936644f092c6178d642292cc))
* allow function to set the response code in the return object ([5d44398](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/5d44398ced5aadcbe0b98018140482c47b02947a))
* allow user set content type for text/plain ([b98396e](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/b98396e4fba54c99bf4faf7e8f0696bd11c414b5))
* parse x-form-urlencoded POST requests ([7996ca4](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/7996ca4c0fdbadd0ebfc65f430582457939e58b6))


### Bug Fixes

* add tests and fix bugs for health check URLs ([4220921](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/42209213ebe9a520c424d524211928a36862f23f))
* set __ow_user to empty string ([1b9ac15](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/1b9ac15f1a93521c52618cc44ac1dc9447ebdc9f))

### 0.0.2 (2019-10-18)


### Features

* framework should not install function deps ([959e5d9](https://github.com/openshift-cloud-functions/faas-js-runtime/commit/959e5d9cda604587bee8f2f7ce09e5f04873b851))
