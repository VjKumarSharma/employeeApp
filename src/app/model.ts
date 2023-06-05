import { FormGroup } from "@angular/forms";

export interface employee {
    id?: number;
    name: string;
    job_title: string;
    age: number;
    start_date: string;
    end_date: string;
    isCurrentlyWorking: boolean;
}
