import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../domain/entities/Appointment';

export class AppointmentService {

    constructor(
        private appointmentRepository: IAppointmentRepository,
        //private notification
    ) {}

    async createAppointment(insuredId: string, scheduleId: number, countrISO: string) {

        const date: Date = new Date();

        const appointment = new Appointment(insuredId, scheduleId, 'pending', countrISO, date, date);

        await this.appointmentRepository.save(appointment);

    }

    async getAppointmentByInsuredId(insuredId: string) {

        const appointments: Appointment[] = await this.appointmentRepository.findByInsuredId(insuredId);

        return appointments;

    }

}