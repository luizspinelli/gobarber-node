import IMailProvider from '../models/IMailProvider';

class MailProvider implements IMailProvider {
    public async sendMail(to: string, body: string): Promise<void> {}
}

export default MailProvider;
