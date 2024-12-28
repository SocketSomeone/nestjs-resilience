import { Cache, createCache } from 'cache-manager';
import { Inject, Optional } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from './resilience.module-definition';
import { ResilienceModuleOptions } from './interfaces';

export class ResilienceStatesManager {
	private static readonly PREFIX = 'nestjs-resilience/';

	private static instance: ResilienceStatesManager;

	public static getInstance(): ResilienceStatesManager {
		if (!ResilienceStatesManager.instance) {
			return new ResilienceStatesManager();
		}

		return ResilienceStatesManager.instance;
	}

	public readonly cache: Cache;

	public constructor(
		@Optional()
		@Inject(MODULE_OPTIONS_TOKEN)
		public readonly options?: ResilienceModuleOptions
	) {
		ResilienceStatesManager.instance = this;
		const stores = options?.stores ?? [];

		if (options?.store) {
			stores.push(options.store);
		}

		this.cache = createCache({ stores });
	}

	public async del(key: string): Promise<boolean> {
		return this.cache.del(ResilienceStatesManager.PREFIX + key);
	}

	public async get<T>(key: string): Promise<T> {
		return this.cache.get(ResilienceStatesManager.PREFIX + key);
	}

	public async reset(): Promise<boolean> {
		return this.cache.clear();
	}

	public async set<T>(key: string, value: T, ttl?: number): Promise<T> {
		return this.cache.set(ResilienceStatesManager.PREFIX + key, value, ttl);
	}

	public async wrap<T>(
		key: string,
		fn: () => Promise<T>,
		ttl?: number | ((value: T) => number)
	): Promise<T> {
		key = ResilienceStatesManager.PREFIX + key;

		return this.cache.wrap(key, fn, ttl);
	}
}
