import { BaseCommand, ReturnTypeOfRun } from './base.command';
import { Observable } from 'rxjs';

export abstract class ResilienceObservableCommand extends BaseCommand {
	public abstract run(...args: any[]): Observable<any>;

	public execute(...args: Parameters<this['run']>): ReturnTypeOfRun<this> {
		let observable = this.run(...args);

		for (const strategy of this.strategies) {
			observable = strategy.process(observable);
		}

		return observable as ReturnTypeOfRun<this>;
	}

	public getExecutionObservable(
		...args: Parameters<this['run']>
	): Observable<ReturnTypeOfRun<this>> {
		return this.execute(...args);
	}
}
