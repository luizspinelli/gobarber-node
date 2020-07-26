import 'reflect-metadata';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('should be able to update avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const fakeStorage = new FakeStorageProvider();

        const createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const updateAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorage,
        );

        const user = await createUserService.execute({
            name: 'john doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        const update = await updateAvatar.execute({
            user_id: user.id,
            avatarFileName: 'fakeFileName',
        });

        expect(update.avatar).toEqual('fakeFileName');
    });

    it('should not be able to update avatar from a non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorage = new FakeStorageProvider();

        const updateAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorage,
        );

        await expect(
            updateAvatar.execute({
                user_id: 'no-user',
                avatarFileName: 'fakeFileName',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to delete an existing avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const fakeStorage = new FakeStorageProvider();

        const deleteFile = jest.spyOn(fakeStorage, 'deleteFile');

        const createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const updateAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorage,
        );

        const user = await createUserService.execute({
            name: 'john doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        await updateAvatar.execute({
            user_id: user.id,
            avatarFileName: 'fakeFileName',
        });

        const update2 = await updateAvatar.execute({
            user_id: user.id,
            avatarFileName: 'fakeFileName2',
        });

        expect(deleteFile).toHaveBeenCalledWith('fakeFileName');

        expect(update2.avatar).toEqual('fakeFileName2');
    });
});
