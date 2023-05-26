import { ResilienceCommand, ResilienceModule, ResilienceService } from '../src';
import { Inject, Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ResilienceStates } from '../src/resilience.states';

interface User {
	id: string;
	name: string;
}

@Injectable()
class UsersService {
	private readonly users: User[] = [
		{
			id: '1',
			name: 'John'
		},
		{
			id: '2',
			name: 'Jane'
		}
	];

	public async getUserById(id: string) {
		return this.users.find(user => user.id === id);
	}
}

class GetUserByIdCommand extends ResilienceCommand {
	@Inject()
	private readonly usersService: UsersService;

	public constructor() {
		super([]);
	}

	public async run(id: string) {
		return this.usersService.getUserById(id);
	}
}

describe('Resilience Command', () => {
	let resilienceService: ResilienceService, statesService: ResilienceStates;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [ResilienceModule],
			providers: [UsersService, GetUserByIdCommand]
		}).compile();

		resilienceService = moduleRef.get<ResilienceService>(ResilienceService);
		statesService = moduleRef.get<ResilienceStates>(ResilienceStates);
	});

	it('should be able to get a command', async () => {
		const command = await resilienceService.getCommand(GetUserByIdCommand);

		expect(command).toBeInstanceOf(GetUserByIdCommand);
	});

	it('should be able to execute a command', async () => {
		const command = await resilienceService.getCommand(GetUserByIdCommand);
		const value = await command.execute('1');

		expect(value).toEqual({
			id: '1',
			name: 'John'
		});
	});
});
