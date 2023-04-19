import { Global, Module } from '@nestjs/common';
import { ResilienceFactory } from './resilience.factory';
import { ResilienceService } from './resilience.service';

@Global()
@Module({
	providers: [ResilienceFactory, ResilienceService],
	exports: [ResilienceFactory, ResilienceService]
})
export class ResilienceModule {}
