import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './resilience.module-definition.js';
import { ResilienceStatesManager } from './resilience.states-manager.js';
import { ResilienceEventBus } from './resilience.event-bus.js';
import { ResilienceFactory } from './resilience.factory.js';
import { ResilienceService } from './resilience.service.js';

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
