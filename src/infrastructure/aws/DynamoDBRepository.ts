import { DynamoDBClient, PutItemCommand, PutItemCommandOutput, QueryCommand, QueryCommandOutput, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../domain/entities/Appointment';
import { config } from '../../config/config';

export class DynamoDBRepository implements IAppointmentRepository {

    private dynamoDBClient: DynamoDBClient = new DynamoDBClient({
        region: config.aws.region
    });

    private tableName = config.aws.dynamoDB.appointmentTableName || 'Appointments';

    async save(appointment: Appointment): Promise<void> {

        const command: PutItemCommand = new PutItemCommand({
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
        
        await this.dynamoDBClient.send(command);

    }

    async findByInsuredId(insuredId: string): Promise<Appointment[]> {


        if (!insuredId || insuredId === '') return [];

        const command: QueryCommand = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: 'insuredId = :id',
            ExpressionAttributeValues: {
                ':id': { S: insuredId }
            }
        });

        const result: QueryCommandOutput = await this.dynamoDBClient.send(command);

        if (!result.Items || result.Items.length == 0) return [];
        
        const appointments: Appointment[] = result.Items.reduce<Appointment[]>((accumulator, item) => {

            const insuredId = item.insuredId?.S;
            const scheduleId = item.scheduleId?.N;
            const status = item.status?.S;
            const countryISO = item.countryISO?.S;
            const createdAt = item.createdAt?.S;
            const updatedAt = item.updatedAt?.S;

            if (insuredId && scheduleId && status && countryISO && createdAt && updatedAt) accumulator.push(
                new Appointment(
                    insuredId,
                    Number(scheduleId),
                    status,
                    countryISO,
                    new Date(createdAt),
                    new Date(updatedAt)
                )
            );

            return accumulator;

        }, []);

        return appointments;

    }

    async updateStatus(insuredId: string, scheduleId: number, status: string): Promise<void> {

        const command = new UpdateItemCommand({
            TableName: this.tableName,
            Key: {
                insuredId: { S: insuredId },
                scheduleId: { N: scheduleId.toString() }
            },
            UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#status': 'status',
                '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
                ':status': { S: status },
                ':updatedAt': { S: new Date().toISOString() }
            }
        });

        await this.dynamoDBClient.send(command);

    }

}