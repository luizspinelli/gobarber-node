import 'reflect-metadata';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list all providers', async () => {
    const user1 = await createUserService.execute({
      name: 'john doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const user2 = await createUserService.execute({
      name: 'john doe2',
      email: 'johndoe2@gmail.com',
      password: '123456',
    });

    const user = await createUserService.execute({
      name: 'john doe3',
      email: 'johndoe3@gmail.com',
      password: '123456',
    });

    const providers = await listProviders.execute({ user_id: user.id });

    expect(providers).toEqual([user1, user2]);
  });
});
