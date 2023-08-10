import { Cache, memoryStore, Milliseconds, Store } from 'cache-manager';
import { Inject, Optional } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from './resilience.module-definition';
import { ResilienceModuleOptions } from './interfaces';

export class ResilienceStatesManager implements Cache {
	private static readonly PREFIX = 'nestjs-resilience/';

	private static instance: ResilienceStatesManager;

	public static getInstance(): ResilienceStatesManager {
		if (!ResilienceStatesManager.instance) {
			return new ResilienceStatesManager();
		}

		return ResilienceStatesManager.instance;
	}

	public readonly store: Store;

	public constructor(
		@Optional()
		@Inject(MODULE_OPTIONS_TOKEN)
		public readonly options?: ResilienceModuleOptions
	) {
		ResilienceStatesManager.instance = this;
		this.store = options?.store ?? memoryStore();
	}

	public async del(key: string): Promise<void> {
		return this.store.del(ResilienceStatesManager.PREFIX + key);
	}

	public async get<T>(key: string): Promise<T> {
		return this.store.get(ResilienceStatesManager.PREFIX + key);
	}

	public async reset(): Promise<void> {
		return this.store.reset();
	}

	public async set(key: string, value: unknown, ttl?: Milliseconds | undefined): Promise<void> {
		return this.store.set(ResilienceStatesManager.PREFIX + key, value, ttl);
	}

	public async wrap<T>(key: string, fn: () => Promise<T>, ttl?: Milliseconds): Promise<T> {
		key = ResilienceStatesManager.PREFIX + key;

		const value = await this.store.get<T>(key);
		if (value === undefined) {
			const result = await fn();
			await this.store.set<T>(key, result, ttl);
			return result;
		}
		return value;
	}
}
