import { BaseResilienceDecorator, TypedHandlerDescriptor } from './base-resilience.decorator.js';
import { ResilienceCommand } from '../commands/index.js';
import { Strategy } from '../strategies/index.js';

export const UseResilience = (...strategies: Strategy[]): TypedHandlerDescriptor<Promise<any>> =>
	BaseResilienceDecorator(ResilienceCommand, strategies);
