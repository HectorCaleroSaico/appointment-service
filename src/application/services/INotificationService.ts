export interface INotificationService {

    publish(message: string): Promise<void>;

}