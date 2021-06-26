import { EmployeeAddress } from "./address.model";
import { Company } from "./company.model";

export interface Employee {
    id: number;
    name: string;
    username: string;
    email: string;
    address: EmployeeAddress;
    phone: string;
    website: string;
    company: Company;
}