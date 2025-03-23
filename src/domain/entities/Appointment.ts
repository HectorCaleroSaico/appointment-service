export class Appointment {

    constructor(
        public insuredId: string,
        public scheduleId: number,
        public status: string,
        public countryISO: string,
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}

}