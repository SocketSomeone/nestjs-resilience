import { Keyv } from 'keyv';

export interface ResilienceModuleOptions {
	/**
	 * The store to use for caching.
	 * @deprecated
	 */
	store?: Keyv;

	/**
	 * The store to use for caching.
	 */
	stores?: Keyv[];
}
