import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export class SNSRepository {

    private snsClient: SNSClient = new SNSClient({
        region: process.env.AWS_REGION
    });

    async publish(snsTopicArnKey: string, message: any) {

        console.log('ENVS: ', process.env);
        console.log('TOPIC_ARN: ', process.env[snsTopicArnKey]);
        
        const command = new PublishCommand({
            TopicArn: process.env[snsTopicArnKey],
            Message: JSON.stringify(message)
        });

        const result = await this.snsClient.send(command);

        return result;

    };


}