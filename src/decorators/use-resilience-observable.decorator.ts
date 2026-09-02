import { Observable } from 'rxjs';

import { BaseResilienceDecorator, TypedHandlerDescriptor } from './base-resilience.decorator.js';
import { ResilienceObservableCommand } from '../commands/index.js';
import { Strategy } from '../strategies/index.js';

export const UseResilienceObservable = (
	...strategies: Strategy[]
): TypedHandlerDescriptor<Observable<any>> =>
	BaseResilienceDecorator(ResilienceObservableCommand, strategies);
