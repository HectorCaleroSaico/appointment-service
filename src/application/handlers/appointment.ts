import { APIGatewayEvent, APIGatewayProxyResult, Context, SQSEvent } from 'aws-lambda';
import { DynamoDBRepository } from '../../infrastructure/aws/DynamoDBRepository';
import { SNSService } from '../../infrastructure/aws/SNSService';
import { AppointmentService } from '../services/AppointmentService';
import { AppointmentDTO } from '../dtos/AppointmentDTO';
import { config } from '../../config/config';

const dynamoDBRepository: DynamoDBRepository = new DynamoDBRepository();

export const handler = async (event: APIGatewayEvent | SQSEvent, context: Context): Promise<APIGatewayProxyResult> => {

    if ('httpMethod' in event) return handleApiGateway(event);

    if ('Records' in event) return handleSQSEvent(event);

    return {
        statusCode: 400,
        body: JSON.stringify({
            message : 'Ivalid event type.'
        })
    };

};

const handleApiGateway = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {

    const httpMethod = event?.httpMethod && event?.httpMethod !== '' ? event.httpMethod : 'GET';

    try {

        if (httpMethod === 'POST') { 

            const params = event?.body ? JSON.parse(event?.body) : {};

            const { insuredId, scheduleId, countryISO } = params;

            if (!insuredId || !scheduleId || !countryISO) return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing required fields.'
                })
            };

            const appointmentDTO: AppointmentDTO = new AppointmentDTO(insuredId, scheduleId, 'pending', countryISO);

            const topicArn: string = config.aws.sns[countryISO].topicArn;

            const snsService: SNSService = new SNSService(topicArn);

            const appointmentService: AppointmentService = new AppointmentService(dynamoDBRepository, snsService);

            await appointmentService.createAppointment(appointmentDTO);

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Appointment created.'
                })
            };

        }

        if (httpMethod === 'GET') {

            const params = event?.pathParameters ? event?.pathParameters : {}

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
                body: JSON.stringify({ data: response })
            };

        }

        return {
            statusCode: 405,
            body: JSON.stringify({
                message: 'Method not allowed.'
            })
        };
        
    } catch (error) {
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error instanceof Error ? error.message : 'Internal server error.'
            })
        };

    }

}

const handleSQSEvent = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {

    try {

        const detailEvent = JSON.parse(event.Records[0].body).detail;
    
        if (!detailEvent?.insuredId || !detailEvent?.scheduleId || !detailEvent?.status) return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing required fields.'
            })
        };

        const appointmentService: AppointmentService = new AppointmentService(dynamoDBRepository);

        await appointmentService.updateAppointmentStatus(detailEvent?.insuredId, detailEvent?.scheduleId, detailEvent?.status);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Appointment updated.'
            })
        };
        
    } catch (error) {
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error instanceof Error ? error.message : 'Internal server error.'
            })
        };

    }

}