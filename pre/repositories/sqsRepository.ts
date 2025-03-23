import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

export class SQSRepository {

    private sqsClient: SQSClient = new SQSClient({
        region: process.env.AWS_REGION
    });

    async sendMessage(queueURL: string, message: any) {

        const command = new SendMessageCommand({
            QueueUrl: queueURL,
            MessageBody: message
        });

        await this.sqsClient.send(command);

    };

}