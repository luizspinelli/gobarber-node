import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

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
    ) {}

    public async execute({
        provider_id,
        month,
        year,
        day,
    }: Request): Promise<Appointment[]> {
        const appointments = await this.appointmentsRepository.findaAllInDayFromProvider(
            {
                provider_id,
                day,
                month,
                year,
            },
        );

        return appointments;
    }
}

export default ListProviderAppointmentsService;
