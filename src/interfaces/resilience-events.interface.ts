import { ResilienceEventType } from '../enum/index.js';
import { BaseCommand } from '../commands/index.js';

export interface ResilienceEvents {
	[ResilienceEventType.Emit]: [command: BaseCommand];
	[ResilienceEventType.Success]: [command: BaseCommand];
	[ResilienceEventType.Failure]: [command: BaseCommand];
	[ResilienceEventType.Timeout]: [command: BaseCommand];
	[ResilienceEventType.ShortCircuit]: [command: BaseCommand];
}
