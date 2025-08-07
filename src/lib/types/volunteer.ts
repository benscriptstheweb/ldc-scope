import type { Timestamp } from "firebase-admin/firestore";

export type Volunteer = {
    id: string,
    name: string,
    email: string,
    phone: number,
    project: string,
    dateStart: Date,
    dateEnd: Date,
}
