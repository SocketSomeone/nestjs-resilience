import { ResilienceEventType } from '../enum';
import { BaseCommand } from '../commands';

export interface ResilienceEvents {
	[key: string | symbol]: any[];

	[ResilienceEventType.Emit]: [command: BaseCommand];
	[ResilienceEventType.Success]: [command: BaseCommand];
	[ResilienceEventType.Failure]: [command: BaseCommand];
	[ResilienceEventType.Timeout]: [command: BaseCommand];
	[ResilienceEventType.ShortCircuit]: [command: BaseCommand];
}
