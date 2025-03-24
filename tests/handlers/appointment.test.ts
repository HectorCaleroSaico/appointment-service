import { handler } from '../../src/application/handlers/appointment';
import { APIGatewayEvent, SQSEvent } from 'aws-lambda';
import { DynamoDBRepository } from '../../src/infrastructure/aws/DynamoDBRepository';
import { SNSService } from '../../src/infrastructure/aws/SNSService';
import { AppointmentService } from '../../src/application/services/AppointmentService';
import { config } from '../../src/config/config';

// Mock de dependencias
jest.mock('../../src/infrastructure/aws/DynamoDBRepository');
jest.mock('../../src/infrastructure/aws/SNSService');
jest.mock('../../src/application/services/AppointmentService');

describe('Appointment Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debería registrar una cita con POST /appointments', async () => {
    const mockCreateAppointment = jest.fn().mockResolvedValue(undefined);
    (AppointmentService as jest.Mock).mockImplementation(() => ({
      createAppointment: mockCreateAppointment
    }));

    const mockSnsArn = 'arn:aws:sns:us-east-1:123456789012:SNS_PE';
    config.aws.sns = { PE: { topicArn: mockSnsArn } };

    const apiEvent: APIGatewayEvent = {
      httpMethod: 'POST',
      body: JSON.stringify({
        insuredId: '12345',
        scheduleId: 100,
        countryISO: 'PE'
      }),
      pathParameters: null,
    } as any;

    const response = await handler(apiEvent, {} as any);

    expect(response.statusCode).toBe(201);
    expect(mockCreateAppointment).toHaveBeenCalled();
  });

  it('❌ Debería retornar 400 si faltan parámetros en POST /appointments', async () => {
    const apiEvent: APIGatewayEvent = {
      httpMethod: 'POST',
      body: JSON.stringify({
        insuredId: '12345', // Falta scheduleId y countryISO
      }),
      pathParameters: null
    } as any;

    const response = await handler(apiEvent, {} as any);

    expect(response.statusCode).toBe(400);
    expect(response.body).toContain('Missing required fields');
  });

  it('❌ Debería retornar 500 si hay un error en createAppointment()', async () => {
    const mockCreateAppointment = jest.fn().mockRejectedValue(new Error('DB Error'));
    (AppointmentService as jest.Mock).mockImplementation(() => ({
      createAppointment: mockCreateAppointment
    }));

    config.aws.sns = { PE: { topicArn: 'arn:aws:sns:us-east-1:123456789012:SNS_PE' } };

    const apiEvent: APIGatewayEvent = {
      httpMethod: 'POST',
      body: JSON.stringify({
        insuredId: '12345',
        scheduleId: 100,
        countryISO: 'PE'
      }),
      pathParameters: null
    } as any;

    const response = await handler(apiEvent, {} as any);

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('DB Error');
  });

  it('Debería retornar una cita con GET /appointments/{insuredId}', async () => {
    const mockGetAppointment = jest.fn().mockResolvedValue([
      { insuredId: '12345', scheduleId: 100, status: 'pending' }
    ]);

    (AppointmentService as jest.Mock).mockImplementation(() => ({
      getAppointmentByInsuredId: mockGetAppointment
    }));

    const apiEvent: APIGatewayEvent = {
      httpMethod: 'GET',
      pathParameters: { insuredId: '12345' }
    } as any;

    const response = await handler(apiEvent, {} as any);

    expect(response.statusCode).toBe(200);
    expect(mockGetAppointment).toHaveBeenCalledWith('12345');
  });

  it('❌ Debería retornar 400 si falta insuredId en GET /appointments/{insuredId}', async () => {
    const apiEvent: APIGatewayEvent = {
      httpMethod: 'GET',
      pathParameters: null // insuredId no está presente
    } as any;

    const response = await handler(apiEvent, {} as any);

    expect(response.statusCode).toBe(400);
    expect(response.body).toContain('Missing required fields');
  });

  it('❌ Debería retornar 500 si hay un error en getAppointmentByInsuredId()', async () => {
    const mockGetAppointment = jest.fn().mockRejectedValue(new Error('DynamoDB Error'));
    (AppointmentService as jest.Mock).mockImplementation(() => ({
      getAppointmentByInsuredId: mockGetAppointment
    }));

    const apiEvent: APIGatewayEvent = {
      httpMethod: 'GET',
      pathParameters: { insuredId: '12345' }
    } as any;

    const response = await handler(apiEvent, {} as any);

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('DynamoDB Error');
  });

  it('Debería procesar un evento de SQS y actualizar el estado de la cita', async () => {
    const mockUpdateStatus = jest.fn().mockResolvedValue(undefined);
    (AppointmentService as jest.Mock).mockImplementation(() => ({
      updateAppointmentStatus: mockUpdateStatus
    }));

    const sqsEvent: SQSEvent = {
      Records: [
        {
          body: JSON.stringify({
            detail: {
              insuredId: '12345',
              scheduleId: 100,
              status: 'completed'
            }
          })
        }
      ]
    } as any;

    const response = await handler(sqsEvent, {} as any);

    expect(response.statusCode).toBe(200);
    expect(mockUpdateStatus).toHaveBeenCalledWith('12345', 100, 'completed');
  });
});
