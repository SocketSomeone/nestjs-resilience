import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './resilience.constants';
import { ResilienceFactory } from './resilience.factory';
import { ResilienceService } from './resilience.service';

@Module({
	providers: [ResilienceFactory, ResilienceService],
	exports: [ResilienceFactory, ResilienceService]
})
export class ResilienceModule extends ConfigurableModuleClass {}
