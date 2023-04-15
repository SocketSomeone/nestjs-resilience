<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
    A module for reliability and fault-tolerance of your <a href="https://nestjs.com/" target="_blank">NestJS</a> applications.
</p>

<p align="center">
    <a href='https://img.shields.io/npm/v/necord'><img src="https://img.shields.io/npm/v/necord" alt="NPM Version" /></a>
    <a href='https://img.shields.io/npm/l/necord'><img src="https://img.shields.io/npm/l/necord" alt="NPM License" /></a>
    <a href='https://img.shields.io/npm/dm/necord'><img src="https://img.shields.io/npm/dm/necord" alt="NPM Downloads" /></a>
    <a href='https://img.shields.io/github/last-commit/SocketSomeone/necord'><img src="https://img.shields.io/github/last-commit/SocketSomeone/necord" alt="Last commit" /></a>
</p>

## About

NestJS Resilience is an open-source library that provides a set of reliable patterns for building resilient applications on top of NestJS.
The library includes several key features, including retry, circuit breaker, and timeout patterns, which help to ensure that your
application can handle failures and recover quickly from them.

With NestJS Resilience, you can easily configure these patterns for your application, allowing you to improve the reliability and
fault-tolerance of your services. Whether you're building a high-traffic web application or a distributed system, NestJS Resilience provides
the tools you need to build robust, failure-resistant services that can withstand even the most challenging environments.

In addition to these core patterns, NestJS Resilience also provides support for other reliability-related features, such as rate limiting,
caching, and logging. These features work together to give you a comprehensive toolkit for building reliable, high-performance applications
that can handle whatever challenges come your way.

**Features**

- **Retry** - Automatically retry failed requests
- **Circuit Breaker** - Automatically fail fast when a service is unavailable
- **Timeout** - Automatically fail fast when a service is taking too long to respond
- **Bulkhead** - Limit the number of concurrent requests to a service
- **Fallback** - Provide a fallback response when a service is unavailable
- **Rate Limiting** - Limit the number of requests to a service

## Installation

```bash
$ npm install nestjs-resilience
$ yarn add nestjs-resilience
$ pnpm add nestjs-resilience
```

## Usage

TODO...

## Stay in touch

* Author - [Alexey Filippov](https://t.me/socketsomeone)
* Twitter - [@SocketSomeone](https://twitter.com/SocketSomeone)

## License

[MIT](https://github.com/SocketSomeone/nestjs-resilience/blob/master/LICENSE) © [Alexey Filippov](https://github.com/SocketSomeone)
