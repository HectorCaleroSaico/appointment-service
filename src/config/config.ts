interface Config {
    aws: {
        region: string;
        appointmentTable: string;
    };
    sns: {
        topicArn: string;
    };
    sqs: {
        peQueueUrl: string;
        clQueueUrl: string;
    };
    database: {
        host: string;
        user: string;
        password: string;
        database: string;
    };
}

export const config =  {
    aws: {
        region: process.env.AWS_REGION,
        dynamoDB: {
            appointmentTableName: 'Appointments'
        },
        sns: {},
        sqs: {},
        eventBridge: {},
    },
    database: {}
}

