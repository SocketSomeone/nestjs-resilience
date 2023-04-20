import { BaseCommand, ReturnTypeOfRun } from './base.command';
import { defer, lastValueFrom, Observable } from 'rxjs';
import { ResilienceEventType } from '../enum';

export abstract class ResilienceCommand extends BaseCommand {
	public abstract run(...args: any[]): Promise<any>;

	public execute(...args: Parameters<this['run']>): ReturnTypeOfRun<this> {
		this.eventBus.emit(ResilienceEventType.Emit, this);

		try {
			let observable: Observable<ReturnTypeOfRun<this>> = defer(() => this.run(...args));

			for (const strategy of this.strategies) {
				observable = strategy.process(observable, ...args);
			}

			return lastValueFrom(observable).then(result => {
				this.onSuccess();
				return result;
			}) as ReturnTypeOfRun<this>;
		} catch (error) {
			throw this.onFailure(error);
		}
	}
}
