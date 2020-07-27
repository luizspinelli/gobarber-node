import 'reflect-metadata';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeStorage: FakeStorageProvider;
let createUserService: CreateUserService;
let updateAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeStorage = new FakeStorageProvider();

        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        updateAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorage,
        );
    });
    it('should be able to update avatar', async () => {
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
        await expect(
            updateAvatar.execute({
                user_id: 'no-user',
                avatarFileName: 'fakeFileName',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to delete an existing avatar', async () => {
        const deleteFile = jest.spyOn(fakeStorage, 'deleteFile');

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
