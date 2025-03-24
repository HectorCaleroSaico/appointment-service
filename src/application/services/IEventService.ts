export interface IEventService {

    sendEvent(detail: any): Promise<void>;

}