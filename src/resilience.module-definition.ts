import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ResilienceModuleOptions } from './interfaces';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
	new ConfigurableModuleBuilder<ResilienceModuleOptions>()
		.setClassMethodName('forRoot')
		.setFactoryMethodName('createModuleConfig')
		.build();
