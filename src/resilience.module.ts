import { Global, Module } from '@nestjs/common';
import { ResilienceFactory } from './resilience.factory';
import { ResilienceService } from './resilience.service';
import { ResilienceMetrics } from './resilience.metrics';
import { ResilienceEventBus } from './resilience.event-bus';
import { ResilienceStates } from './resilience.states';
import { CacheModule } from '@nestjs/cache-manager';

const eventBusProvider = {
	provide: ResilienceEventBus,
	useValue: ResilienceEventBus.getInstance()
};

@Global()
@Module({
	imports: [
		CacheModule.register({
			isGlobal: true
		})
	],
	providers: [
		eventBusProvider,
		ResilienceStates,
		ResilienceFactory,
		ResilienceService,
		ResilienceMetrics
	],
	exports: [
		eventBusProvider,
		ResilienceStates,
		ResilienceFactory,
		ResilienceService,
		ResilienceMetrics
	]
})
export class ResilienceModule {}
