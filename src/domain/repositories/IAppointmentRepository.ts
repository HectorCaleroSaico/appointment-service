import { Appointment } from '../entities/Appointment';

export interface IAppointmentRepository {

    save(appointment: Appointment): Promise<void>;

    findByInsuredId(insuredId: string): Promise<Appointment[]>;

    updateStatus(insuredId: string, sheduleId: number, status: string): Promise<void>;

}