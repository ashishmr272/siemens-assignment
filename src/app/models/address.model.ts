import { EmployeeLocation } from "./location.model";

export interface EmployeeAddress {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: EmployeeLocation;
}