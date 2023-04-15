import { Injectable } from '@nestjs/common';
import { ResilienceFactory } from './resilience.factory';
import { MetricsService } from './metrics';

@Injectable()
export class ResilienceService {
	public constructor(
		private readonly factory: ResilienceFactory,
		private readonly metrics: MetricsService
	) {}
}
