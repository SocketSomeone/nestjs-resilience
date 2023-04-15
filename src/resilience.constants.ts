import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ResilienceModuleOptions } from './resilience-options.interface';

export const {
	ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN: RESILIENCE_MODULE_OPTIONS,
	OPTIONS_TYPE,
	ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<ResilienceModuleOptions>()
	.setFactoryMethodName('createResilienceOptions')
	.build();
