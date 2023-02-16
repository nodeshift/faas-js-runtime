# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.10.0](https://github.com/nodeshift/faas-js-runtime/compare/v0.9.7...v0.10.0) (2023-02-16)


### Features

* upgrade commander from 9.5.0 to 10.0.0 ([#168](https://github.com/nodeshift/faas-js-runtime/issues/168)) ([64a41b2](https://github.com/nodeshift/faas-js-runtime/commit/64a41b2474b16f1aa66081980db023983c98a6cb))


### Bug Fixes

* killing the process hangs issue ([#172](https://github.com/nodeshift/faas-js-runtime/issues/172)) ([3ac8b9d](https://github.com/nodeshift/faas-js-runtime/commit/3ac8b9dd6497b173f2208c72884c01ccbd129b6c)), closes [#120](https://github.com/nodeshift/faas-js-runtime/issues/120)
* upgrade commander from 9.4.1 to 9.5.0 ([#164](https://github.com/nodeshift/faas-js-runtime/issues/164)) ([ead35e6](https://github.com/nodeshift/faas-js-runtime/commit/ead35e66f578fedbbafa1c89893c012292f3df1b))
* upgrade fastify from 4.10.2 to 4.11.0 ([#165](https://github.com/nodeshift/faas-js-runtime/issues/165)) ([f417755](https://github.com/nodeshift/faas-js-runtime/commit/f41775508d03e4bc8e32a8b056ab970a84756bf3))
* upgrade fastify from 4.11.0 to 4.12.0 ([#171](https://github.com/nodeshift/faas-js-runtime/issues/171)) ([3daf323](https://github.com/nodeshift/faas-js-runtime/commit/3daf3235fa5bd0140e4d31f8b7d5b82df940886b))
* upgrade prom-client from 14.1.0 to 14.1.1 ([#166](https://github.com/nodeshift/faas-js-runtime/issues/166)) ([9a7b0f3](https://github.com/nodeshift/faas-js-runtime/commit/9a7b0f36ec7206ab5fdf1dac913b01e67d5c885e))
* upgrade tape from 5.6.1 to 5.6.3 ([#170](https://github.com/nodeshift/faas-js-runtime/issues/170)) ([edc07c5](https://github.com/nodeshift/faas-js-runtime/commit/edc07c586f4458df7455492d042e402686a840f0))


### Miscellaneous

* Add the node version support to the readme. ([#174](https://github.com/nodeshift/faas-js-runtime/issues/174)) ([9e14879](https://github.com/nodeshift/faas-js-runtime/commit/9e14879b101c5dccfafe6ecc2d326397ea8846b3))
* add the type property to the package.json. ([#167](https://github.com/nodeshift/faas-js-runtime/issues/167)) ([9886d87](https://github.com/nodeshift/faas-js-runtime/commit/9886d8735510bc58e2acb5fb00819b55c4aa8774))
* **deps:** update transitive dependencies ([#148](https://github.com/nodeshift/faas-js-runtime/issues/148)) ([8389cbe](https://github.com/nodeshift/faas-js-runtime/commit/8389cbe9839aa32d8231e79c19b136a160874482))
* **deps:** updates eslint and friends ([#160](https://github.com/nodeshift/faas-js-runtime/issues/160)) ([880a573](https://github.com/nodeshift/faas-js-runtime/commit/880a57333f4e001e6074ed57cd7751c52707ee5c))
* **deps:** upgrade eslint-config-prettier from 8.3.0 to 8.6.0 ([#158](https://github.com/nodeshift/faas-js-runtime/issues/158)) ([59390eb](https://github.com/nodeshift/faas-js-runtime/commit/59390ebcace837f0e3e02b7df074042afc44ca24))
* **deps:** upgrade node-os-utils from 1.3.5 to 1.3.7 ([#159](https://github.com/nodeshift/faas-js-runtime/issues/159)) ([edfe61a](https://github.com/nodeshift/faas-js-runtime/commit/edfe61abf67c76b248104fd561c9f54bc6bbc88c))
* **deps:** upgrade tape from 5.3.1 to 5.6.1 ([#157](https://github.com/nodeshift/faas-js-runtime/issues/157)) ([3c7acaa](https://github.com/nodeshift/faas-js-runtime/commit/3c7acaaa445bfca447e69bb3e36e7f807687304d))
* update README.md and package.json for nodeshift ([#173](https://github.com/nodeshift/faas-js-runtime/issues/173)) ([1944025](https://github.com/nodeshift/faas-js-runtime/commit/19440259b7794c71423ef710d40cb6c89221fbcb))

## [0.9.7](https://github.com/boson-project/faas-js-runtime/compare/v0.9.6...v0.9.7) (2023-01-06)


### Bug Fixes

* modify module loader to look in parent directories ([#144](https://github.com/boson-project/faas-js-runtime/issues/144)) ([2a1e618](https://github.com/boson-project/faas-js-runtime/commit/2a1e618afd0078ceeffa94232c6c55b0584d5842))

## [0.9.6](https://github.com/boson-project/faas-js-runtime/compare/v0.9.5...v0.9.6) (2022-12-09)


### Features

* Import functions that are written as ES Modules ([#140](https://github.com/boson-project/faas-js-runtime/issues/140)) ([6ac6fff](https://github.com/boson-project/faas-js-runtime/commit/6ac6fffec091e9ed87d74a39f8c8390bc28d8ee6))

## [0.9.5](https://github.com/boson-project/faas-js-runtime/compare/v0.9.4...v0.9.5) (2022-11-09)


### Bug Fixes

* **types:** use CloudEvent&lt;unknown&gt; for typed events ([#137](https://github.com/boson-project/faas-js-runtime/issues/137)) ([03b1ffe](https://github.com/boson-project/faas-js-runtime/commit/03b1ffe4eb8ffdd3c1070a7a82684f0681bdb65e))

## [0.9.4](https://github.com/boson-project/faas-js-runtime/compare/v0.9.3...v0.9.4) (2022-11-08)


### Bug Fixes

* **cloudevents:** bump to latest release ([#135](https://github.com/boson-project/faas-js-runtime/issues/135)) ([c7f9331](https://github.com/boson-project/faas-js-runtime/commit/c7f9331de905a17e7b5a7ef1c099a7df690cf91d))

## [0.9.3](https://github.com/boson-project/faas-js-runtime/compare/v0.9.2...v0.9.3) (2022-11-08)


### Miscellaneous

* **release-please:** bump node version ([#133](https://github.com/boson-project/faas-js-runtime/issues/133)) ([74e231d](https://github.com/boson-project/faas-js-runtime/commit/74e231dde65477e377e73ad009ba86e19445aac0))

## [0.9.2](https://github.com/boson-project/faas-js-runtime/compare/v0.9.1...v0.9.2) (2022-11-03)


### Features

* **http-functions:** supply HTTP POST body ([#129](https://github.com/boson-project/faas-js-runtime/issues/129)) ([25cdcba](https://github.com/boson-project/faas-js-runtime/commit/25cdcba3d7f58b0d202efc1864455bff855583be))


### Miscellaneous

* **coverage:** upload coverage stats to codecov.io ([#127](https://github.com/boson-project/faas-js-runtime/issues/127)) ([4206e31](https://github.com/boson-project/faas-js-runtime/commit/4206e31cbe4a4dcc4a4e322fc7f2b2d66bc2c9e8))
* **deps:** bump fastify to 4.9.x ([#128](https://github.com/boson-project/faas-js-runtime/issues/128)) ([35403b5](https://github.com/boson-project/faas-js-runtime/commit/35403b54053ea194171ae6fd5afd458926f93ba9))
* **release-please:** specify changelog headings ([#130](https://github.com/boson-project/faas-js-runtime/issues/130)) ([5ed0cff](https://github.com/boson-project/faas-js-runtime/commit/5ed0cff1f7e8989aa713aa76571f1cbebd6c4830))


### Documentation

* **README.md:** update with interfaces and types ([#131](https://github.com/boson-project/faas-js-runtime/issues/131)) ([058fc77](https://github.com/boson-project/faas-js-runtime/commit/058fc77ef0ebf8c74eb48e1f53e7f5e04cfbebe0))

### [0.9.1](https://www.github.com/boson-project/faas-js-runtime/compare/v0.9.0...v0.9.1) (2022-05-27)


### Bug Fixes

* add an explicit scope to function invocation ([#118](https://www.github.com/boson-project/faas-js-runtime/issues/118)) ([1eb75b3](https://www.github.com/boson-project/faas-js-runtime/commit/1eb75b3cec416cf96509a59a7af98d885f7de6c1))

## [0.9.0](https://www.github.com/boson-project/faas-js-runtime/compare/v0.8.0...v0.9.0) (2022-04-28)


### Features

* support binary data in cloudevents ([#112](https://www.github.com/boson-project/faas-js-runtime/issues/112)) ([2ce6c05](https://www.github.com/boson-project/faas-js-runtime/commit/2ce6c051f5c3c99269d2db9bf29be61ec3a24e80))

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
