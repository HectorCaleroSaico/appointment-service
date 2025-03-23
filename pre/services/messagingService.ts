import { SNSRepository } from '../repositories/snsRepository';
import { Appointment } from '../../models/appointment';

export class MessagingService {

    private snsRepository: SNSRepository = new SNSRepository();

    async AddMessageToTopic(appointment: Appointment) {

        const snsTopicArnKey = `SNS_TOPIC_${appointment.countryISO}_ARN`
    
        const result = await this.snsRepository.publish(snsTopicArnKey, appointment);

        console.log('SNS Topic:', result);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'SNS message sended.'
            })
        };

    };

}