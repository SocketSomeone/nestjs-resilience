import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './resilience.constants';

@Module({})
export class ResilienceModule extends ConfigurableModuleClass {}
