import { Global, Module } from '@nestjs/common';
import { ResilienceFactory } from './resilience.factory';
import { ResilienceService } from './resilience.service';
import { ResilienceMetrics } from './resilience.metrics';
import { ResilienceEventBus } from './resilience.event-bus';

const eventBusProvider = {
	provide: ResilienceEventBus,
	useValue: ResilienceEventBus.getInstance()
};

@Global()
@Module({
	providers: [eventBusProvider, ResilienceFactory, ResilienceService, ResilienceMetrics],
	exports: [eventBusProvider, ResilienceService, ResilienceMetrics]
})
export class ResilienceModule {}
