import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './resilience.module-definition';
import { ResilienceStatesManager } from './resilience.states-manager';
import { ResilienceEventBus } from './resilience.event-bus';
import { ResilienceFactory } from './resilience.factory';
import { ResilienceService } from './resilience.service';

const eventBusProvider = {
	provide: ResilienceEventBus,
	useValue: ResilienceEventBus.getInstance()
};

@Global()
@Module({
	providers: [eventBusProvider, ResilienceStatesManager, ResilienceFactory, ResilienceService],
	exports: [eventBusProvider, ResilienceFactory, ResilienceService]
})
export class ResilienceModule extends ConfigurableModuleClass {}
