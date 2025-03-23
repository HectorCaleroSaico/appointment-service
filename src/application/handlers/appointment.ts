import { APIGatewayEvent, APIGatewayProxyResult, Context, LambdaFunctionURLResult } from 'aws-lambda';
import { DynamoDBRepository } from '../../infrastructure/aws/DynamoDBRepository';
import { AppointmentService } from '../services/AppointmentService';

const dynamoDBRepository: DynamoDBRepository = new DynamoDBRepository();
/*
const actions: Record<'POST' | 'GET', (arg: any) => Promise<any>> = {
    'POST': async (appointment: Appointment) => await appointmentService.createAppointment(appointment),
    'GET': async ({ insureId }: { insureId: string }) => await appointmentService.getAppointments(insureId)
}
*/
export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

    console.log('Lambda V2 version - TS');

    console.log('Event: ', event);

    const httpMethod = event?.httpMethod && event?.httpMethod !== '' ? event.httpMethod : 'GET';
    const params = event?.body && httpMethod === 'POST' ? JSON.parse(event?.body) : event?.pathParameters;

    console.log({
        httpMethod,
        params
    });
    
    try {
        
        if (httpMethod === 'POST') { 

            const { insuredId, scheduleId, countryISO } = params;

            if (!insuredId || !scheduleId || !countryISO) return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing required fields.'
                })
            };


            const appointmentService: AppointmentService = new AppointmentService(dynamoDBRepository);


            await appointmentService.createAppointment(insuredId, scheduleId, countryISO);

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Appointment created.'
                })
            };

        }

        if (httpMethod === 'GET') {

            const { insuredId } = params;

            if (!insuredId) return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing required fields.'
                })
            };

            const appointmentService: AppointmentService = new AppointmentService(dynamoDBRepository);

            const response = await appointmentService.getAppointmentByInsuredId(insuredId);

            return {
                statusCode: 200,
                body: JSON.stringify({
                    appointments: response
                })
            };

        }

        return {
            statusCode: 405,
            body: JSON.stringify({
                message: 'Method not allowed.'
            })
        };
        
    } catch (error) {

        console.log('Error: ', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error instanceof Error ? error.message : 'Internal server error.'
            })
        }
        
    }

};