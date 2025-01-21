export class Random {
	public static Between(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	public static Boolean(): boolean {
		return Math.random() >= 0.5;
	}

	public static Array<T>(array: T[]): T {
		return array[Math.floor(Math.random() * array.length)];
	}

	public static String(length: number): string {
		return Math.random()
			.toString(36)
			.substring(2, length + 2);
	}
}
