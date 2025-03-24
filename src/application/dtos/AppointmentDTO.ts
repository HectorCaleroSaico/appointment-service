export class AppointmentDTO {
    
    constructor(
        public readonly insuredId: string,
        public readonly scheduleId: number,
        public readonly status: string,
        public readonly countryISO: string
    ) {}

}