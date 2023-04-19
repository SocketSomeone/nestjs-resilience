import { BaseCommand, ReturnTypeOfRun } from './base.command';
import { defer, lastValueFrom, Observable } from 'rxjs';

export abstract class ResilienceCommand extends BaseCommand {
	public abstract run(...args: any[]): Promise<any>;

	public execute(...args: Parameters<this['run']>): ReturnTypeOfRun<this> {
		let observable: Observable<ReturnTypeOfRun<this>> = defer(() => this.run(...args));

		for (const strategy of this.strategies) {
			observable = strategy.process(observable);
		}

		return lastValueFrom(observable) as ReturnTypeOfRun<this>;
	}
}
