import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implemantations/DiskStorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import MailProvider from './MailProvider/implementation/MailProvider';

container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    DiskStorageProvider,
);

container.registerSingleton<IMailProvider>('MailProvider', MailProvider);
