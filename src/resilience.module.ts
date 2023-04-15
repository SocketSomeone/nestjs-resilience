import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './resilience.constants';
import { ResilienceFactory } from './resilience.factory';
import { MetricsModule } from './metrics';
import { ResilienceService } from './resilience.service';

@Module({
	imports: [MetricsModule],
	providers: [ResilienceFactory, ResilienceService],
	exports: [ResilienceFactory, ResilienceService]
})
export class ResilienceModule extends ConfigurableModuleClass {}
