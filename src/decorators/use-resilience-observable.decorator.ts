import { Observable } from 'rxjs';

import { BaseResilienceDecorator, TypedHandlerDescriptor } from './base-resilience.decorator';
import { ResilienceObservableCommand } from '../commands';
import { Strategy } from '../strategies';

export const UseResilienceObservable = (
	...strategies: Strategy[]
): TypedHandlerDescriptor<Observable<any>> =>
	BaseResilienceDecorator(ResilienceObservableCommand, strategies);
