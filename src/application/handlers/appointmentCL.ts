import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

    console.log('Event: ', event);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Appointment PE executed.'
        })
    };

};