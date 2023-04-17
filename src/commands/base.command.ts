import { Inject, Logger } from '@nestjs/common';
import { ResilienceFactory } from '../resilience.factory';
import { EventEmitter } from 'events';
import { Strategy } from '../strategies';

export type ParametersOfRun<T extends BaseCommand> = Parameters<T['run']>;
export type ReturnTypeOfRun<T extends BaseCommand> = ReturnType<T['run']>;
export type Run<T extends BaseCommand> = T['run'];

export abstract class BaseCommand extends EventEmitter {
	protected readonly logger = new Logger(this.constructor.name);

	protected strategies: Strategy[] = [];

	protected group: string = this.constructor.name;

	protected name: string = this.constructor.name;

	protected fallback: this['run'];

	protected healthCheck: () => boolean;

	@Inject()
	protected readonly factory: ResilienceFactory;

	public constructor(group: string) {
		super();

		this.group = group;
	}

	public setStrategies(strategies: Strategy[]): this {
		this.strategies = strategies;
		return this;
	}

	public setGroup(group: string): this {
		this.group = group;
		return this;
	}

	public setName(name: string): this {
		this.name = name;
		return this;
	}

	public setFallback(fallback: Run<this>): this {
		this.fallback = fallback;
		return this;
	}

	public setHealthCheck(healthCheck: () => boolean): this {
		this.healthCheck = healthCheck;
		return this;
	}

	public abstract run(...args: any[]): any;

	public getFallbackOrThrow(args: ParametersOfRun<this>, err: any): ReturnTypeOfRun<this> {
		if (!this.fallback) {
			throw err;
		}

		return this.fallback(...args);
	}

	public getHealthCheck() {
		if (!this.healthCheck) {
			return true;
		}

		return this.healthCheck();
	}
}
