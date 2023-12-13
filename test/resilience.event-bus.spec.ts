import { ResilienceEventBus, ResilienceEventType } from '../src';

jest.useFakeTimers();

describe('ResilienceEventBus', () => {
	const resilienceEventBus = ResilienceEventBus.getInstance();

	const events: ResilienceEventType[] = [
		ResilienceEventType.Emit,
		ResilienceEventType.Success,
		ResilienceEventType.Failure,
		ResilienceEventType.Timeout,
		ResilienceEventType.ShortCircuit
	];

	it('should be a singleton', () => {
		const anotherResilienceEventBus = ResilienceEventBus.getInstance();
		expect(resilienceEventBus).toBe(anotherResilienceEventBus);
	});

	for (const event of events) {
		it(`should be able to emit ${event}`, () => {
			const callback = jest.fn();
			resilienceEventBus.on(event, callback);
			resilienceEventBus.emit(event, null);
			expect(callback).toHaveBeenCalledWith([null]);
		});
	}
});
