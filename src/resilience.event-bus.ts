import { EventEmitter } from 'events';
import { ResilienceEvents } from './interfaces';

export class ResilienceEventBus {
	private static readonly instance = new ResilienceEventBus();

	public static getInstance(): ResilienceEventBus {
		return ResilienceEventBus.instance;
	}

	private constructor() {}

	private readonly emitter = new EventEmitter();

	public on<K extends keyof ResilienceEvents>(event: K, fn: (args: ResilienceEvents[K]) => void) {
		this.emitter.on(event, (...args) => fn.call(this, args));
		return this;
	}

	public emit<K extends keyof ResilienceEvents>(event: K, ...args: ResilienceEvents[K]) {
		this.emitter.emit(event, ...args);
		return this;
	}
}
