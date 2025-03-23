import { SQSEvent, Context } from 'aws-lambda';
import { EventService } from '../services/eventService';
import { Appointment } from '../models/appointment';

const eventService: EventService = new EventService();

export const handler = async (event: SQSEvent, context: Context) => {

    console.log('Evento: ', event);

    const notificationSQS = event?.Records[0] ? JSON.parse(event.Records[0]['body']) : null;

    console.log('Params: ', notificationSQS);

    const appointment: Appointment = {
        insuredId: notificationSQS?.insuredId,
        scheduleId: notificationSQS?.scheduleId,
        countryISO: notificationSQS?.countryISO,
        status: notificationSQS?.status,
        date: notificationSQS?.date
    };

    const response = eventService.publishEvent(appointment);

    console.log('Response: ', response);

    return {
        statusCode: 200,
        body: JSON.stringify({ 
            message: 'Event to Event bridge sended.'
        })
    };

};