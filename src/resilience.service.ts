import { Injectable } from '@nestjs/common';
import { ResilienceFactory } from './resilience.factory';

@Injectable()
export class ResilienceService {
	public constructor(private readonly factory: ResilienceFactory) {}
}
