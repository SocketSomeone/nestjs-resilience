import { ResilienceCommand } from '../../src';
import { retryStrategy } from './fixtures/strategy.fixture';

class TestCommand extends ResilienceCommand {
	protected strategies = [retryStrategy];

	private count = 0;

	public async run() {
		this.count += 1;

		if (this.count !== 3) {
			throw new Error('Test');
		}

		return 1000;
	}
}

describe('Resilience Command', () => {
	it('should be able to retry a promise', async () => {
		const command = new TestCommand('test');
		const value = await command.execute();

		expect(value).toBe(1000);
	});
});
