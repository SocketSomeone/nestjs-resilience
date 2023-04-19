import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class ResilienceService {
	public constructor(private readonly moduleRef: ModuleRef) {}

	public getCommand<T>(command: Type<T>): Promise<T> {
		return this.moduleRef.get(command, { strict: false });
	}
}
