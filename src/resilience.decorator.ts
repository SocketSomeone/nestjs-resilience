import { ResilienceCommand, ResilienceObservableCommand } from './commands';
import { Strategy } from './strategies';
import { Observable } from 'rxjs';

type TypedHandlerDescriptor<T> = (
	target: Object,
	propertyKey: string | symbol | undefined,
	descriptor: TypedPropertyDescriptor<(...args: any[]) => T>
) => TypedPropertyDescriptor<(...args: any[]) => T> | void;

function ResilienceDecorator(baseClass: any, strategies: Strategy[]) {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		class Command extends baseClass {
			public run = null;

			public constructor() {
				super(strategies, target.constructor.name, propertyKey);
			}
		}

		const command = new Command();

		descriptor.value = function (...args: any[]) {
			if (command.run === null) {
				command.run = originalMethod.bind(this);
			}

			return command.execute(...args);
		};

		return descriptor;
	};
}

export const UseResilience = (...strategies: Strategy[]): TypedHandlerDescriptor<Promise<any>> =>
	ResilienceDecorator(ResilienceCommand, strategies);

export const UseResilienceObservable = (
	...strategies: Strategy[]
): TypedHandlerDescriptor<Observable<any>> =>
	ResilienceDecorator(ResilienceObservableCommand, strategies);
