import { ExecuteSqlCommandOutput, ExecuteStatementCommand, RDSDataClient } from '@aws-sdk/client-rds-data';
import { Appointment } from '../../domain/entities/Appointment';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { config } from '../../config/config';

export class RDSRepository implements IAppointmentRepository {

    private rdsDataClient: RDSDataClient = new RDSDataClient({
        region: config.aws.region
    });

    async save(appointment: Appointment): Promise<void> {
        
        const query = `CALL sp_post_appointments(:insuredId, :scheduleId, :status, :countryISO)`;

        const configDatabase = config.database[appointment.countryISO];

        try {
            
            const command: ExecuteStatementCommand = new ExecuteStatementCommand({
                resourceArn: configDatabase.arn,
                secretArn: configDatabase.secretArn,
                database: configDatabase.scheme,
                sql: query,
                parameters: [
                    { 
                        name: 'insuredId', 
                        value: { stringValue: appointment.insuredId }
                    },
                    { 
                        name: 'scheduleId', 
                        value: { longValue: appointment.scheduleId }
                    },
                    { 
                        name: 'status', 
                        value: { stringValue: appointment.status }
                    },
                    { 
                        name: 'countryISO', 
                        value: { stringValue: appointment.countryISO }
                    }
                ]
            });
    
            await this.rdsDataClient.send(command);

        } catch (error) {
            
            return;

        }


    }

    async findByInsuredId(insuredId: string): Promise<Appointment[]> {
        
        return [];

    }

    async updateStatus(insuredId: string, sheduleId: number, status: string): Promise<void> {}

}