import type { Hosts } from "./hosts";
import type { OccupantType } from "./occupantType";
import type { Project } from "./project";

export type Home = {
    // built in to homes
    id: string;
    address1: string;
    address2: string
    city: string;
    state: string;
    zip: string;
    max_days_stay: number;
    congregation: string;
    distance_to_project: number;
    date_available: string;
    occupant_type: OccupantType;

    // foreign key relations
    hosts: Hosts
    project: Project;
}
