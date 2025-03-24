import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { INotificationService } from './INotificationService';
import { IEventService } from './IEventService';
import { Appointment } from '../../domain/entities/Appointment';
import { AppointmentDTO } from '../dtos/AppointmentDTO';

export class AppointmentService {

    constructor(
        private appointmentRepository: IAppointmentRepository,
        private notificationService?: INotificationService,
        private eventService?: IEventService
    ) {}

    async createAppointment(appointmentDTO: AppointmentDTO) {

        const date: Date = new Date();

        const appointment = new Appointment(appointmentDTO.insuredId, appointmentDTO.scheduleId, appointmentDTO.status, appointmentDTO.countryISO, date, date);

        await this.appointmentRepository.save(appointment);

        if (this.notificationService) await this.notificationService?.publish(JSON.stringify(appointmentDTO));

        if (this.eventService) await this.eventService.sendEvent(appointmentDTO);

    }

    async getAppointmentByInsuredId(insuredId: string) {

        const appointments: Appointment[] = await this.appointmentRepository.findByInsuredId(insuredId);

        return appointments;

    }

    async updateAppointmentStatus(insuredId: string, scheduleId: number, status: string) {

        await this.appointmentRepository.updateStatus(insuredId, scheduleId, status);

    }

}