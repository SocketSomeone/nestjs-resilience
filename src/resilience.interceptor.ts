import { Strategy } from './strategies';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Type } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ResilienceObservableCommand } from './commands';

export function ResilienceInterceptor<T>(...strategies: Strategy[]): Type<NestInterceptor> {
	class InterceptorCommand extends ResilienceObservableCommand {
		public constructor(run: (...args: any[]) => Observable<any>, group: string, name: string) {
			super(strategies, group, name);

			this.run = run;
		}

		public run: (...args: any[]) => Observable<any>;
	}

	@Injectable()
	class Interceptor implements NestInterceptor {
		public intercept(
			context: ExecutionContext,
			next: CallHandler<any>
		): Observable<any> | Promise<Observable<any>> {
			const [group, name] = [context.getClass(), context.getHandler()].map(it => it.name);
			const command = new InterceptorCommand(next.handle.bind(next), group, name);

			return command.execute();
		}
	}

	return Interceptor;
}
