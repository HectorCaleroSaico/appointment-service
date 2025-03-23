import { EventBridgeRespository } from '../repositories/eventBridgeRepository';
import { Appointment } from '../models/appointment';

export class EventService {

    private eventBridgeRepository: EventBridgeRespository = new EventBridgeRespository();

    async publishEvent(appointment: Appointment) {

        const result = await this.eventBridgeRepository.putEvent(appointment.insuredId, appointment.scheduleId, appointment.status);

        console.log('Result Event Bridge: ', result);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Event triggered.'
            })
        };

    }

}