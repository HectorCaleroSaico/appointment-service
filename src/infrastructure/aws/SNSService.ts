import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { INotificationService } from '../../application/services/INotificationService';
import { config } from '../../config/config';

export class SNSService implements INotificationService {

    private snsClient: SNSClient = new SNSClient({
        region: config.aws.region
    });

    private topicArn: string;

    constructor(topicArn: string) {
        this.topicArn = topicArn;
    }

    async publish(message: string): Promise<void> {
        
        const command: PublishCommand = new PublishCommand({
            TopicArn: this.topicArn,
            Message: message
        });

        await this.snsClient.send(command);

    }

}