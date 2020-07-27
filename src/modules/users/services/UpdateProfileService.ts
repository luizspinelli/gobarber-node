// import User from '@modules/users/infra/typeorm/entities/User';
// import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

interface Request {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        user_id,
        name,
        email,
        password,
        old_password,
    }: Request): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        const checkEmail = await this.usersRepository.findByEmail(email);

        if (checkEmail && checkEmail.id !== user_id) {
            throw new AppError('Email is already in use');
        }

        user.name = name;
        user.email = email;

        if (password && !old_password) {
            throw new AppError('It is necessary to informe old password');
        }

        if (password && old_password) {
            const checkPassword = await this.hashProvider.compareHash(
                old_password,
                user.password,
            );

            if (!checkPassword) {
                throw new AppError('Old password incorrect');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateProfileService;
