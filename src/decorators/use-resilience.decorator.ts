import { Strategy } from '../strategies';
import { ResilienceCommand } from '../commands';

export function UseResilience(...strategies: Strategy[]) {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		class Command extends ResilienceCommand {
			public strategies: Strategy[] = strategies;

			public group: string = target.constructor.name;

			public name: string = propertyKey;

			public run = null;
		}

		const command: ResilienceCommand = new Command(target.constructor.name);

		descriptor.value = function (...args: any[]) {
			if (command.run === null) {
				command.run = originalMethod.bind(this);
			}

			return command.execute(...args);
		};

		return descriptor;
	};
}
