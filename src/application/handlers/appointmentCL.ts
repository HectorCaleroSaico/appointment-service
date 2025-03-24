import { APIGatewayProxyResult, Context, SQSEvent } from 'aws-lambda';
import { RDSRepository } from '../../infrastructure/database/RDSRepository';
import { AppointmentService } from '../services/AppointmentService';
import { EventBridgeService } from '../../infrastructure/aws/EventBridgeService';
import { AppointmentDTO } from '../dtos/AppointmentDTO';

const rdsRepository: RDSRepository = new RDSRepository();
const eventBridgeService: EventBridgeService = new EventBridgeService();

export const handler = async (event: SQSEvent, context: Context): Promise<APIGatewayProxyResult> => {

    try {
        
        const message = JSON.parse(JSON.parse(event.Records[0].body)?.Message);
    
        if (!message?.insuredId || !message?.scheduleId || !message?.countryISO) return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing required fields.'
            })
        };
    
        const appointmentDTO: AppointmentDTO = new AppointmentDTO(message.insuredId, message.scheduleId, 'completed', message.countryISO);
    
        const appointmenService: AppointmentService = new AppointmentService(rdsRepository, undefined, eventBridgeService);
    
        await appointmenService.createAppointment(appointmentDTO);
    
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Appointment created in RDS PE.'
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


};