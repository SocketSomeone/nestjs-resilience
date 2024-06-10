import { Strategy } from '../strategies';
import { Observable } from 'rxjs';
import { ResilienceObservableCommand } from '../commands';
import { BaseResilienceDecorator, TypedHandlerDescriptor } from './base-resilience.decorator';

export const UseResilienceObservable = (
	...strategies: Strategy[]
): TypedHandlerDescriptor<Observable<any>> =>
	BaseResilienceDecorator(ResilienceObservableCommand, strategies);
