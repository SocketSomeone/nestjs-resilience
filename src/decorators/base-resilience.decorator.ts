import { Strategy } from '../strategies';

export type TypedHandlerDescriptor<T> = (
	target: Object,
	propertyKey: string | symbol | undefined,
	descriptor: TypedPropertyDescriptor<(...args: any[]) => T>
) => TypedPropertyDescriptor<(...args: any[]) => T> | void;

interface CommandMetadata {
	baseClass: any;
	strategies: Strategy[];
	className: string;
	propertyKey: string;
}

const cache = new WeakMap<any, Record<string, any>>();

export function BaseResilienceDecorator(baseClass: any, strategies: Strategy[]) {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: any[]) {
			const command = getOrCreateCommand(this, originalMethod, {
				baseClass,
				strategies,
				className: target.constructor.name,
				propertyKey
			});

			return command.execute(...args);
		};

		return descriptor;
	};
}

function getOrCreateCommand(instance: any, method: any, metadata: CommandMetadata) {
	const resiliencyCommands = cache.get(instance) ?? {};

	if (!resiliencyCommands[metadata.propertyKey]) {
		class Command extends metadata.baseClass {
			public run = method.bind(instance);

			public constructor() {
				super(metadata.strategies, metadata.className, metadata.propertyKey);
			}
		}

		resiliencyCommands[metadata.propertyKey] = new Command();
		cache.set(instance, resiliencyCommands);
	}

	return resiliencyCommands[metadata.propertyKey];
}
