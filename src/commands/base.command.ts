import { Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import { Strategy } from '../strategies';

export type ParametersOfRun<T extends BaseCommand> = Parameters<T['run']>;
export type ReturnTypeOfRun<T extends BaseCommand> = ReturnType<T['run']>;
export type Run<T extends BaseCommand> = T['run'];

export abstract class BaseCommand extends EventEmitter {
	protected readonly logger = new Logger(this.constructor.name);

	protected strategies: Strategy[];

	protected group: string;

	protected name: string;

	public constructor(strategies: Strategy[], group?: string, name?: string) {
		super();

		this.strategies = strategies;
		this.group = group ?? 'default';
		this.name = name ?? this.constructor.name;
	}

	/**
	 * Abstract method to be implemented by the command
	 * @param args
	 */
	public abstract run(...args: any[]): any;

	public abstract execute(...args: ParametersOfRun<this>): ReturnTypeOfRun<this>;
}
