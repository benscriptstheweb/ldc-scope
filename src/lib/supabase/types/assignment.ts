import type { Home } from "./home";
import type { Volunteer } from "./volunteer";

export type Assignment = {
    id: string;
    home_id: Home | null;
    volunteer_id: Volunteer | null;
}