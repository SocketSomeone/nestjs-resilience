export namespace Stopwatch {
	export namespace PerformanceHooks {
		export const isAvailable =
			typeof performance !== 'undefined' && typeof performance.now === 'function';

		export function Start(): number {
			return performance.now();
		}

		export function Stop(start: number): number {
			return performance.now() - start;
		}
	}

	export namespace ProcessHrtime {
		export function Start(): bigint {
			return process.hrtime.bigint();
		}

		export function Stop(start: bigint): number {
			return Number((process.hrtime.bigint() - start) / BigInt(1000000));
		}
	}

	export function Create(): () => number {
		if (PerformanceHooks.isAvailable) {
			const start = PerformanceHooks.Start();
			return () => PerformanceHooks.Stop(start);
		}

		const start = ProcessHrtime.Start();
		return () => ProcessHrtime.Stop(start);
	}
}
