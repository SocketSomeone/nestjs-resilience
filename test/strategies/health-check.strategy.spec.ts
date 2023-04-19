import { Observable } from 'rxjs';
import { HealthCheckFailedException, HealthCheckStrategy } from '../../src';

describe('HealthCheckStrategy', () => {
	const observable = new Observable<number>();

	it('should return the observable', () => {
		const strategy = new HealthCheckStrategy(() => true);
		const result = strategy.process(observable);
		expect(result).toBe(observable);
	});

	it('should throw error if health check fails', () => {
		const strategy = new HealthCheckStrategy(() => false);
		strategy.process(observable).subscribe({
			error: error => expect(error).toBeInstanceOf(HealthCheckFailedException)
		});
	});
});
