import { EventBridgeClient, PutEventsCommand, PutEventsCommandOutput } from '@aws-sdk/client-eventbridge';
import { IEventService } from '../../application/services/IEventService';
import { config } from '../../config/config';

export class EventBridgeService implements IEventService {

    private detailType = config.aws.eventBridge.detailType;
    private eventBusName = config.aws.eventBridge.eventBus

    private eventBridgeClient: EventBridgeClient = new EventBridgeClient({
        region: config.aws.region
    });

    async sendEvent(detail: any) {

        const command: PutEventsCommand = new PutEventsCommand({
            Entries: [
                {
                    Source: 'appointment.service',
                    DetailType: this.detailType,
                    Detail: JSON.stringify(detail),
                    EventBusName: this.eventBusName
                }
            ]
        });

        await this.eventBridgeClient.send(command);

    }

}