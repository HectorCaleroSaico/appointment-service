import { AppointmentRepository } from '../repositories/appointmentRepository';
import { Appointment } from '../../models/appointment';

export class AppointmentService {
    
    private appointmentRepository: AppointmentRepository = new AppointmentRepository();

    async createAppointment(appointment: Appointment) {

        await this.appointmentRepository.save(appointment);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Appointment created.'
            })
        };

    };

    async updateAppointmentStatus(insuredId: string, scheduleId: number, status: string) {
        
        const appointments = await this.appointmentRepository.update(insuredId, scheduleId, status);

        return {
            statusCode: 200,
            body: JSON.stringify(appointments)
        };

    };

    async getAppointments(insuredId?: string) {

        const appointments = await this.appointmentRepository.findByInsureId(insuredId);

        return {
            statusCode: 200,
            body: JSON.stringify(appointments)
        };

    };

}