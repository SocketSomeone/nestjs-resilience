import { ResilienceCommand, ResilienceEventBus, ResilienceEventType } from '../../src';
import { retryStrategy } from './fixtures/strategy.fixture';

class TestCommand extends ResilienceCommand {
	private count = 0;

	private isError = false;

	public setCount(count: number) {
		this.count = count;
	}

	public setIsError(isError: boolean) {
		this.isError = isError;
	}

	public async run() {
		this.count += 1;

		if (this.isError) {
			throw new Error('Test');
		}

		if (this.count !== 3) {
			throw new Error('Test');
		}

		return 1000;
	}
}

describe('Resilience Command', () => {
	const command = new TestCommand([retryStrategy]);
	const eventBus = ResilienceEventBus.getInstance();

	let callback = jest.fn();

	beforeEach(() => {
		command.setCount(0);
		command.setIsError(false);
		callback = jest.fn();
	});

	it('should be able to retry a promise', async () => {
		eventBus.on(ResilienceEventType.Success, callback);

		const value = await command.execute();

		expect(value).toBe(1000);
		expect(callback).toHaveBeenCalled();
	});

	it('should emit the failure', async () => {
		command.setIsError(true);
		eventBus.on(ResilienceEventType.Failure, callback);

		try {
			await command.execute();
		} catch (error) {
			expect(error.message).toBe('Test');
			expect(callback).toHaveBeenCalled();
		}
	});
});
