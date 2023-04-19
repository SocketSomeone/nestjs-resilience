import { BaseCommand, ReturnTypeOfRun } from './base.command';
import { defer, lastValueFrom, Observable } from 'rxjs';

export abstract class ResilienceCommand extends BaseCommand {
	public abstract run(...args: any[]): Promise<any>;

	public execute(...args: Parameters<this['run']>): ReturnTypeOfRun<this> {
		return lastValueFrom(this.getExecutionObservable(...args)) as ReturnTypeOfRun<this>;
	}

	public getExecutionObservable(
		...args: Parameters<this['run']>
	): Observable<ReturnTypeOfRun<this>> {
		let observable: Observable<ReturnTypeOfRun<this>> = defer(() => this.run(...args));

		for (const strategy of this.strategies) {
			observable = strategy.process(observable);
		}

		return observable;
	}
}
