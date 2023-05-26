import { map, of } from 'rxjs';
import { FallbackStrategy } from '../../src';

describe('FallbackStrategy', () => {
	const fallbackValue = 'fallback value';
	const fallbackFn = jest.fn(() => fallbackValue);

	it('should process observable and return fallback value on error', () => {
		// Arrange
		const strategy = new FallbackStrategy(fallbackFn);
		const observable = of('value');

		// Act
		const result = strategy.process(
			observable.pipe(
				map(() => {
					throw new Error('error');
				})
			),
			null
		);

		// Assert
		result.subscribe(value => expect(value).toBe(fallbackValue));
		expect(fallbackFn).toHaveBeenCalled();
	});
});
