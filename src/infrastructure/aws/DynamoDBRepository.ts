import { DynamoDBClient, PutItemCommand, PutItemCommandOutput, QueryCommand, QueryCommandOutput } from '@aws-sdk/client-dynamodb';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../domain/entities/Appointment';
import { config } from '../../config/config';

const tableName = config.aws.dynamoDB.appointmentTableName || 'Appointments';

/*
const dynamoDBClient: DynamoDBClient = new DynamoDBClient({
    region: config.aws.region
});
*/

export class DynamoDBRepository implements IAppointmentRepository {

    private dynamoDBClient: DynamoDBClient = new DynamoDBClient({
        region: config.aws.region
    });

    private tableName = config.aws.dynamoDB.appointmentTableName || 'Appointments';


    async save(appointment: Appointment): Promise<void> {

        const command = new PutItemCommand({
            TableName: this.tableName,
            Item: {
                insuredId: { S: appointment.insuredId },
                scheduleId: { N: String(appointment.scheduleId) },
                status: { S: appointment.status },
                countryISO: { S: appointment.countryISO },
                createdAt: { S: new Date().toISOString() },
                updatedAt: { S: new Date().toISOString() }
            }
        });
        
        const result: PutItemCommandOutput = await this.dynamoDBClient.send(command);

        console.log('Result: ', result);

    }

    async findByInsuredId(insuredId: string): Promise<Appointment[]> {


        if (!insuredId || insuredId === '') return [];

        const command = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: 'insuredId = :id',
            ExpressionAttributeValues: {
                ':id': { S: insuredId }
            }
        });

        const result: QueryCommandOutput = await this.dynamoDBClient.send(command);

        console.log('Result: ', result);

        console.log('Items: ', result?.Items);

        return [];

    }

    async updateStatus(insuredId: string, sheduleId: number, status: string): Promise<void> {}

}