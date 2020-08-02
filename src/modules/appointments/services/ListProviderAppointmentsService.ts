import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

interface Request {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: Request): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}:${month}:${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    console.log(cacheKey, 'olá');

    if (!appointments) {
      appointments = await this.appointmentsRepository.findaAllInDayFromProvider(
        {
          provider_id,
          day,
          month,
          year,
        },
      );

      console.log('Buscou no banco');

      await this.cacheProvider.save(cacheKey, appointments);
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;
