import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

export class EventBridgeRespository {

    private eventBridgeClient: EventBridgeClient = new EventBridgeClient({
        region: process.env.AWS_REGION
    });

    private eventBusName = process.env.EVENT_BUS_NAME;

    async putEvent(insuredId: string, scheduleId: number, status: string) {

        const command = new PutEventsCommand({
            Entries: [
                {
                    EventBusName: this.eventBusName,
                    Source: 'appointment.service',
                    DetailType: 'AppointmentCompleted',
                    Detail: JSON.stringify({
                        insuredId,
                        scheduleId,
                        status
                    })
                }
            ]
        });

        const result = await this.eventBridgeClient.send(command);

        return result;

    }

}