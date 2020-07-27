import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update the profile', async () => {
        const user = await createUserService.execute({
            name: 'john doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Doe alterado',
            email: 'johndoe2@gmail.com',
        });

        expect(updatedUser.name).toBe('John Doe alterado');
        expect(updatedUser.email).toBe('johndoe2@gmail.com');
    });

    it('should not be able to update to another user email ', async () => {
        await createUserService.execute({
            name: 'john doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        const user = await createUserService.execute({
            name: 'john doe2',
            email: 'johndoe2@gmail.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Doe alterado',
                email: 'johndoe@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await createUserService.execute({
            name: 'john doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Doe alterado',
            email: 'johndoe@gmail.com',
            old_password: '123456',
            password: '321321',
        });

        expect(updatedUser.password).toBe('321321');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await createUserService.execute({
            name: 'john doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Doe alterado',
                email: 'johndoe@gmail.com',
                password: '321321',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await createUserService.execute({
            name: 'john doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Doe alterado',
                email: 'johndoe@gmail.com',
                old_password: 'wrong old password',
                password: '321321',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update a non-existing user', async () => {
        await expect(
            updateProfile.execute({
                user_id: 'non-existing user',
                name: 'John Doe alterado',
                email: 'johndoe@gmail.com',
                old_password: 'wrong old password',
                password: '321321',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
