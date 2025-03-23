import { APIGatewayEvent, Context } from 'aws-lambda';
import { AppointmentService } from '../services/appointmentService';
import { MessagingService } from '../services/messagingService';
import { Appointment } from '../models/appointment';

const appointmentService: AppointmentService = new AppointmentService();
const messagingService: MessagingService = new MessagingService();
/*
const actions: Record<'POST' | 'GET', (arg: any) => Promise<any>> = {
    'POST': async (appointment: Appointment) => await appointmentService.createAppointment(appointment),
    'GET': async ({ insureId }: { insureId: string }) => await appointmentService.getAppointments(insureId)
}
*/
export const handler = async (event: APIGatewayEvent, context: Context) => {

    console.log('Event: ', event);

    const httpMethod = event?.httpMethod && event?.httpMethod !== '' ? event.httpMethod : 'GET';
    const params = event?.body && httpMethod === 'POST' ? JSON.parse(event?.body) : event?.pathParameters;

    console.log({
        httpMethod,
        params
    });
    
    try {
        
        /*const response = await actions[httpMethod as 'POST' | 'GET'](params);
        console.log('Response: ', response);

        return response;*/
        if (httpMethod === 'POST') { 

            const appointment: Appointment = {
                ...params,
                status: 'pending',
                date: new Date().toISOString()
            };

            const response = await appointmentService.createAppointment(appointment);

            const responseSNS = await messagingService.AddMessageToTopic(appointment);

            console.log('Response: ', response);
            console.log('Response: ', responseSNS);

            return response;

        }

        if (httpMethod === 'GET') {

            const response = await appointmentService.getAppointments(params?.insuredId);

            console.log('Response: ', response);

            return response;

        }
        
    } catch (error) {

        console.log('Error: ', error);

        return {
            statusCode: 500,
            body: {
                error: error instanceof Error ? error.message : 'Ocurrió un error desconocido.'
            }
        }
        
    }

};