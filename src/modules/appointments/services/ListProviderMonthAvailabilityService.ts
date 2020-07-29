import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface Request {
    provider_id: string;
    month: number;
    year: number;
}

type Response = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        month,
        year,
    }: Request): Promise<Response> {
        const appointments = this.appointmentsRepository.findAllInMonthFromProvider(
            {
                provider_id,
                month,
                year,
            },
        );

        console.log(appointments);

        return [{ available: false, day: 1 }];
    }
}

export default ListProviderMonthAvailabilityService;
