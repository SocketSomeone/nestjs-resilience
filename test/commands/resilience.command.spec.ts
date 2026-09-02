import { ResilienceCommand, ResilienceEventBus, ResilienceEventType } from '../../src/index.js';
import { retryStrategy } from './fixtures/strategy.fixture.js';

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

	let callback = vi.fn<() => void>();

	beforeEach(() => {
		command.setCount(0);
		command.setIsError(false);
		callback = vi.fn<() => void>();
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

		await expect(command.execute()).rejects.toThrow('Test');
		expect(callback).toHaveBeenCalled();
	});
});
