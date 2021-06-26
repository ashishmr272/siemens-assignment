import { Employee } from "./employee.model";

export interface ActionEvent {
    employee: Employee;
    action: string;
}