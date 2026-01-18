import type { Assignment } from "./assignment";
import { OccupantType } from "./occupantType";
import type { Project } from "./project";

export type Volunteer = {
    // built into volunteeres
    id: string;
    name: string;
    email: string;
    phone: number | null;
    date_start: string;
    date_end: string;
    type: OccupantType;

    // foreign key relations
    assignments: Assignment[];
    project: Project;
}
