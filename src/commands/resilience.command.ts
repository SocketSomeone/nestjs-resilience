import { BaseCommand, ReturnTypeOfRun } from './base.command';
import { catchError, defer, lastValueFrom, Observable, tap } from 'rxjs';
import { ResilienceEventType } from '../enum';

export abstract class ResilienceCommand extends BaseCommand {
	public abstract run(...args: any[]): Promise<any>;

	public execute(...args: Parameters<this['run']>): ReturnTypeOfRun<this> {
		this.eventBus.emit(ResilienceEventType.Emit, this);

		let observable: Observable<ReturnTypeOfRun<this>> = defer(() => this.run(...args));

		for (const strategy of this.strategies) {
			observable = strategy.process(observable, this, ...args);
		}

		return lastValueFrom(
			observable.pipe(
				catchError(error => {
					throw this.onFailure(error);
				}),
				tap(() => this.onSuccess())
			)
		) as ReturnTypeOfRun<this>;
	}
}
