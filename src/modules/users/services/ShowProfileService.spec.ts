import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able to show profile', async () => {
        const user = await createUserService.execute({
            name: 'john doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        const userProfile = await showProfile.execute({ user_id: user.id });

        expect(userProfile.name).toBe('john doe');
    });

    it('should not be able to show profile', async () => {
        await expect(
            showProfile.execute({ user_id: 'non-existing user' }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
