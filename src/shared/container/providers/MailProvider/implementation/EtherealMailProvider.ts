import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import ISendMailDTO from '../dtos/ISendMailDTO';

import IMailProvider from '../models/IMailProvider';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
class EtherealMailProvider implements IMailProvider {
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider,
    ) {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });

            this.client = transporter;
        });
    }

    public async sendMail({
        to,
        subject,
        from = { name: 'Equipe GoBarber', mail: 'equipe@gobarber.com.br' },
        templateData,
    }: ISendMailDTO): Promise<void> {
        const message = await this.client.sendMail({
            from: {
                name: from.name,
                address: from.mail,
            },
            to: {
                name: to.name,
                address: to.mail,
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        });

        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default EtherealMailProvider;
