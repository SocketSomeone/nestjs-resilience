import { Strategy } from '../strategies';
import { ResilienceCommand } from '../commands';
import { BaseResilienceDecorator, TypedHandlerDescriptor } from './base-resilience.decorator';

export const UseResilience = (...strategies: Strategy[]): TypedHandlerDescriptor<Promise<any>> =>
	BaseResilienceDecorator(ResilienceCommand, strategies);
