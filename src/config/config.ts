interface Config {
    aws: {
        region: string;
        dynamoDB: {
            appointmentTableName: string
        },
        sns: {
            [key: string]: {
                topicArn: string
            }
        },
        eventBridge: {
            detailType: string,
            eventBus: string
        }
    };
    database: {
        [key: string]: {
            arn: string,
            secretArn: string,
            scheme: string
        }
    }
    /*database: {
        host: string;
        user: string;
        password: string;
        database: string;
    };*/
}

export const config: Config =  {
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        dynamoDB: {
            appointmentTableName: 'Appointments'
        },
        sns: {
            PE: {
                topicArn: process.env.SNS_TOPIC_PE_ARN || ''
            },
            CL: {
                topicArn: process.env.SNS_TOPIC_CL_ARN || ''
            }
        },
        eventBridge: {
            detailType: 'AppointmentCompleted',
            eventBus: 'AppointmentBus'
        }
    },
    database: {
        PE: {
            arn: process.env.RDS_CLUSTER_PE_ARN || '',
            secretArn: process.env.RDS_SECRET_PE_ARN || '',
            scheme: 'main'
        },
        CL: {
            arn: process.env.RDS_CLUSTER_CL_ARN || '',
            secretArn: process.env.RDS_SECRET_CL_ARN || '',
            scheme: 'main'
        }
    }
}

