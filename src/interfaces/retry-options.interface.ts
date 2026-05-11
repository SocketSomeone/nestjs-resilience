import { Type } from '@nestjs/common';

import { Backoff } from '../helpers';

export interface RetryOptions {
	maxRetries?: number;
	maxDelay?: number;
	backoff?: Backoff | Type<Backoff>;
	scaleFactor?: number;
	retryable?: (error: Error) => boolean;
}
