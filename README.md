<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
    A module for improving the reliability and fault-tolerance of your <a href="https://nestjs.com/" target="_blank">NestJS</a> applications
</p>

<p align="center">
    <a href='https://img.shields.io/npm/v/nestjs-resilience'><img src="https://img.shields.io/npm/v/nestjs-resilience" alt="NPM Version" /></a>
    <a href='https://img.shields.io/npm/l/nestjs-resilience'><img src="https://img.shields.io/npm/l/nestjs-resilience" alt="NPM License" /></a>
    <a href='https://img.shields.io/npm/dm/nestjs-resilience'><img src="https://img.shields.io/npm/dm/nestjs-resilience" alt="NPM Downloads" /></a>
    <a href='https://img.shields.io/github/last-commit/SocketSomeone/nestjs-resilience'><img src="https://img.shields.io/github/last-commit/SocketSomeone/nestjs-resilience" alt="Last commit" /></a>
</p>

## About

NestJS Resilience is an open-source library that provides a set of reliable patterns for building resilient applications on top of NestJS.
The library includes several key features, including retry, circuit breaker, and timeout patterns, which help to ensure that your
application can handle failures and recover quickly from them.

With NestJS Resilience, you can easily configure these patterns for your application, allowing you to improve the reliability and
fault-tolerance of your services. Whether you're building a high-traffic web application or a distributed system, NestJS Resilience provides
the tools you need to build robust, failure-resistant services that can withstand even the most challenging environments.

**Features**

- **Circuit Breaker** - Automatically fail fast when a service is unavailable
- **Retry** - Automatically retry failed requests
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

### Import the module

```typescript
import { Module } from '@nestjs/common';
import { ResilienceModule } from 'nestjs-resilience';

@Module({
    imports: [ResilienceModule]
})
```

### Ways to use

You can use it in three ways:

#### 1. Use `ResilienceCommand`

You can create a command by extending the `ResilienceCommand` class. You can also use the `ResilienceFactory` to create a command with a set
of policies.

```typescript
import { Injectable } from '@nestjs/common';
import { ResilienceCommand, ResilienceFactory } from 'nestjs-resilience';
import { UsersService } from './user.service';
import { User, NullUserObject } from './user.entity';

@Injectable()
export class GetUserByIdCommand extends ResilienceCommand {
    constructor(
        private readonly factory: ResilienceFactory,
        private readonly userService: UsersService
    ) {
        super([
            // You can use the injected factory to create a strategy
            factory.createTimeout(1000),
            // Or you can create a strategy directly
            ResilienceFactory.createFallback((id) => new NullUserObject(id))
            // You can also use mannually created strategies
            // new TimeoutStrategy(1000),
        ]);
    }

    async execute(id: number): User {
        return this.usersService.getUser(id);
    }
}
```

This way supports DI, just what you need add `@Injectable()` decorator to your command and to providers of your module. Inject your
command in the constructor or use `resilienceService.getCommand(GetUserByIdCommand)`.

> - Can I use `@Inject()` decorator? Yes, you can. But you need to add `@Injectable()` decorator to your command.
>
> - Can I use w/o DI? Yes, you can. Just create a command with `new` operator.

#### 2. Use the `@UseResilience()` decorator

You can use `@UseResilience()` decorator to wrap your **service** methods.

```typescript
import { Injectable } from '@nestjs/common';
import { TimeoutStrategy } from "./timeout.strategy";
import { NullUserObject, User } from './user.entity';

@Injectable()
export class UsersService {
    @UseResilience(new TimeoutStrategy(1000), ResilienceFactory.createFallback((id) => new NullUserObject(id)))
    async getUser(id: number): User {
        return this.httpService.get(`https://example.com/users/${id}`).toPromise();
    }
}
```

> Not the best way to use in controller methods. `@UseResilience` rewrite your method. 

#### 3. Interceptors

You also can wrap your controller methods with `ResilienceInterceptor` and use all the features of the library.

```typescript
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ResilienceInterceptor } from 'nestjs-resilience';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    @UseInterceptors(ResilienceInterceptor(new TimeoutStrategy(1000), ResilienceFactory.createFallback(() => [])))
    async getUsers(): User[] {
        return this.usersService.getUsers();
    }
}
```

#### Observables

We also support `Observable` as a return type. You can use it with `@UseResilienceObservable()` decorator or `ResilienceCommandObservable`.

```typescript
import { Injectable } from '@nestjs/common';
import { TimeoutStrategy } from "./timeout.strategy";
import { NullUserObject, User } from './user.entity';
import { Observable, of } from 'rxjs';

@Injectable()
export class UsersService {
    @UseResilienceObservable(new TimeoutStrategy(1000), ResilienceFactory.createFallback((id) => new NullUserObject(id)))
    getUser(id: number): Observable<User> {
        return of(new User(id, 'John Doe'));
    }
}
```

#### Order of execution

Strategies processing in order which you pass them to the `ResilienceCommand` or `ResilienceInterceptor`.

What it means? Let's take a look at the example:

**Timeout before Retry:**

- If the command is executed successfully, the result will be returned.
- If the command is executed with an error or timed out, the command will be retried.
- If the command is executed with an error or timed out and the number of retries is exceeded, the error will be thrown.

**Retry after Timeout:**

- If the command is executed successfully, the result will be returned.
- If the command is executed with an error, the command will be retried.
- If the command is executed with an error and the number of retries is exceeded, the error will be thrown.
- If the command is executed with an error and the number of retries is exceeded or timed out, the error will be thrown.

### Strategies

| Strategy                 | Description                                                          |
|--------------------------|----------------------------------------------------------------------|
| `TimeoutStrategy`        | Automatically fail fast when a service is taking too long to respond |
| `RetryStrategy`          | Automatically retry failed requests                                  |
| `CircuitBreakerStrategy` | Automatically fail fast when a service is unavailable                |
| `BulkheadStrategy`       | Limit the number of concurrent requests to a service                 |
| `FallbackStrategy`       | Provide a fallback response when a service is unavailable            |
| `ThrottleStrategy`       | Limit the number of requests to a service                            |
| `HealthCheckStrategy`    | Check the health of a service                                        |
| `CacheStrategy`          | Cache the result of a service call                                   |

#### Metrics

We collect metrics for each command. You can use it to monitor the health of your services.
    
```typescript
import { Injectable } from '@nestjs/common';
import { ResilienceMetrics } from 'nestjs-resilience';

@Injectable()
export class MetricsService {
    constructor(private readonly metrics: ResilienceMetrics) {
    }

    getMetrics(): any {
        return this.metrics.getMetrics();
    }
}
```


## Stay in touch

* Author - [Alexey Filippov](https://t.me/socketsomeone)
* Twitter - [@SocketSomeone](https://twitter.com/SocketSomeone)

## License

[MIT](https://github.com/SocketSomeone/nestjs-resilience/blob/master/LICENSE) © [Alexey Filippov](https://github.com/SocketSomeone)
