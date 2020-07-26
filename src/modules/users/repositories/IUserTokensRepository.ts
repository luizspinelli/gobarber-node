import UserTokens from '@modules/users/infra/typeorm/entities/UserTokens';

export default interface IUsersTokensRepository {
    generate(user_id: string): Promise<UserTokens>;
}
