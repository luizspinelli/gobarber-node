import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getHours, isAfter } from 'date-fns';

interface Request {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

type Response = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        month,
        year,
        day,
    }: Request): Promise<Response> {
        const appointments = await this.appointmentsRepository.findaAllInDayFromProvider(
            {
                day,
                month,
                provider_id,
                year,
            },
        );

        const eachHourArray = Array.from(
            {
                length: 10,
            },
            (_, index) => index + 8,
        );

        const currentDate = new Date(Date.now());

        const availability = eachHourArray.map(hour => {
            const hasAppointmentInHour = appointments.find(
                appointment => getHours(appointment.date) === hour,
            );

            const compareDate = new Date(year, month - 1, day, hour);

            return {
                hour,
                available:
                    !hasAppointmentInHour && isAfter(compareDate, currentDate),
            };
        });

        return availability;
    }
}

export default ListProviderDayAvailabilityService;
