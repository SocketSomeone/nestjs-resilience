import { Strategy } from '../strategies';
import { ResilienceObservableCommand } from '../commands';

export function UseResilienceObservable(...strategies: Strategy[]) {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		class Command extends ResilienceObservableCommand {
			public group: string = target.constructor.name;

			public name: string = propertyKey;

			public run = null;
		}

		const command: ResilienceObservableCommand = new Command(strategies);

		descriptor.value = function (...args: any[]) {
			if (command.run === null) {
				command.run = originalMethod.bind(this);
			}

			return command.execute(...args);
		};

		return descriptor;
	};
}
