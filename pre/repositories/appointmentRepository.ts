import { DynamoDBClient, PutItemCommand, UpdateItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { ExecuteStatementCommand, RDSDataClient } from '@aws-sdk/client-rds-data';
import { Appointment } from '../../models/appointment';

export class AppointmentRepository {

    private tableName: string = 'Appointments';

    private dynamoDBClient: DynamoDBClient = new DynamoDBClient({
        region: process.env.AWS_REGION
    });

    private rdsDataClient: RDSDataClient = new RDSDataClient({
        region: process.env.AWS_REGION
    });

    async save(appointment: Appointment) {

        const command = new PutItemCommand({
            TableName: this.tableName,
            Item: {
                insuredId: { S: appointment.insuredId },
                scheduleId: { N: String(appointment.scheduleId) },
                countryISO: { S: appointment.countryISO },
                status: { S: appointment.status },
                date: { S: appointment.date }
            }
        });

        const saveAppointment = await this.dynamoDBClient.send(command);

        console.log('saved: ', saveAppointment);

    };

    async update(insuredId: string, scheduleId: number, status: string) {

        const command = new UpdateItemCommand({
            TableName: 'Appointments',
            Key: {
                insuredId: { S: insuredId },
                scheduleId: { N: String(scheduleId) }
            },
            UpdateExpression: 'SET status = :status',
            ExpressionAttributeValues: {
                ':status': { S: status }
            }
        })

        const result = await this.dynamoDBClient.send(command);

        return result;

    };

    async findByInsureId(insuredId?: string) {

        if (!insuredId || insuredId === '') return [];

        const command = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: 'insuredId = :id',
            ExpressionAttributeValues: {
                ':id': { S: insuredId }
            }
        });

        const result = await this.dynamoDBClient.send(command)

        return result.Items || [];

    };

    async saveRDS(appointment: Appointment) {

        const keyResourceArn = `RDS_CLUSTER_${appointment.countryISO}_ARN`;
        const keySecretArn = `RDS_SECRET_${appointment.countryISO}_ARN`;

        const command = new ExecuteStatementCommand({
            resourceArn: process.env[keyResourceArn],
            secretArn: process.env[keySecretArn],
            database: 'main',
            sql: 'INSERT INTO appointments (insuredId, scheduleId, countryISO, status, date) VALUES (:insuredId, :scheduleId, :countryISO, :status, :date)`',
            parameters: [
                { name: 'insuredId', value: { stringValue: appointment.insuredId } },
                { name: 'scheduleId', value: { longValue: appointment.scheduleId } },
                { name: 'countryISO', value: { stringValue: appointment.countryISO } },
                { name: 'status', value: { stringValue: 'pending' } },
                { name: 'date', value: { stringValue: appointment.date } }
            ]
        });

        const result = await this.rdsDataClient.send(command);

        return result;

    }

}