import { Logger } from '@nestjs/common';
import { Strategy } from '../strategies';
import { ResilienceEventBus } from '../resilience.event-bus';
import { ResilienceEventType } from '../enum';
import { CircuitOpenedException, TimeoutException } from '../exceptions';

export type ParametersOfRun<T extends BaseCommand> = Parameters<T['run']>;
export type ReturnTypeOfRun<T extends BaseCommand> = ReturnType<T['run']>;

export abstract class BaseCommand {
	protected readonly logger: Logger;

	protected readonly eventBus = new ResilienceEventBus();

	protected readonly strategies: Strategy[];

	public readonly group: string;

	public readonly name: string;

	public constructor(strategies: Strategy[], group?: string, name?: string) {
		this.strategies = strategies;
		this.group = group ?? 'default';
		this.name = name ?? this.constructor.name;
		this.logger = new Logger(`${this.group}#${this.name}`);
	}

	/**
	 * Abstract method to be implemented by the command
	 * @param args
	 */
	public abstract run(...args: any[]): any;

	public abstract execute(...args: ParametersOfRun<this>): ReturnTypeOfRun<this>;

	public onSuccess() {
		this.eventBus.emit(ResilienceEventType.Success, this);
		console.log('onSuccess');
	}

	protected onFailure(error: any) {
		if (error instanceof TimeoutException) {
			this.eventBus.emit(ResilienceEventType.Timeout, this);
			return error;
		}

		if (error instanceof CircuitOpenedException) {
			this.eventBus.emit(ResilienceEventType.ShortCircuit, this);
			return error;
		}

		this.eventBus.emit(ResilienceEventType.Failure, this);
		return error;
	}
}
