import { Backoff } from '../helpers';
import { Type } from '@nestjs/common';

export interface RetryOptions {
	maxRetries?: number;
	maxDelay?: number;
	backoff?: Backoff | Type<Backoff>;
	scaleFactor?: number;
	retryable?: (error: Error) => boolean;
}
