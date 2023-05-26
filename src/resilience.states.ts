import { Inject, Optional } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache, memoryStore, Store } from 'cache-manager';

export class ResilienceStates {
	private static instance: ResilienceStates;

	private readonly storage: Store;

	public constructor(
		@Optional()
		@Inject(CACHE_MANAGER)
		cacheManager?: Cache
	) {
		ResilienceStates.instance = this;

		this.storage ??= cacheManager.store ?? memoryStore();
	}

	public async get<T = any>(key: string): Promise<T> {
		return this.storage.get(key);
	}

	public async set<T = any>(key: string, value: any, ttl?: number): Promise<void> {
		return this.storage.set(key, value, ttl);
	}

	public async has(key: string): Promise<boolean> {
		const value = await this.get(key);

		return value !== undefined;
	}

	public delete(key: string): Promise<void> {
		return this.storage.del(key);
	}

	public reset(): Promise<void> {
		return this.storage.reset();
	}

	public static getInstance() {
		if (!ResilienceStates.instance) {
			return new ResilienceStates();
		}

		return ResilienceStates.instance;
	}
}
