import { BaseResilienceDecorator, TypedHandlerDescriptor } from './base-resilience.decorator';
import { ResilienceCommand } from '../commands';
import { Strategy } from '../strategies';

export const UseResilience = (...strategies: Strategy[]): TypedHandlerDescriptor<Promise<any>> =>
	BaseResilienceDecorator(ResilienceCommand, strategies);
