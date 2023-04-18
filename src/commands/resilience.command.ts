import { BaseCommand, ReturnTypeOfRun } from './base.command';
import { defer, lastValueFrom, Observable } from 'rxjs';
import { HealthCheckFailedException } from '../exceptions';

export abstract class ResilienceCommand extends BaseCommand {
	public abstract run(...args: any[]): Promise<any>;

	public execute(...args: Parameters<this['run']>): ReturnTypeOfRun<this> {
		try {
			if (!this.getHealthCheck()) {
				throw new HealthCheckFailedException();
			}

			let observable: Observable<ReturnTypeOfRun<this>> = defer(() => this.run(...args));

			for (const strategy of this.strategies) {
				observable = strategy.process(observable);
			}

			return lastValueFrom(observable) as ReturnTypeOfRun<this>;
		} catch (err) {
			return this.getFallbackOrThrow(args, err);
		}
	}
}
