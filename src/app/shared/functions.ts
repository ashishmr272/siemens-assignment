import { Subscription } from "rxjs";
import { Employee } from "../models/employee.model";

export const checkIfArrayContainsData = (array: any[]) => {
    return (array && array.length > 0) ? true : false;
}

export const getUpdatedEmployeeList = (originalEmployeeList: Employee[], employeeList: Employee[], id: number) => {
    const emp = originalEmployeeList.find(e => e.id === id);
    const updatedList = [...employeeList];
    if (emp) {
        updatedList.push({ ...emp });
    }
    return updatedList.sort(sortFunction)
}

export const sortFunction = (a: Employee, b: Employee) => a.id - b.id;

export const uniqueValue = (value: any, index: any, self: any) => {
    return self.indexOf(value) === index;
}

export const unsubscribe = (subsList: Subscription[]) => {
    subsList.forEach((subs) => {
        if (subs) {
            subs.unsubscribe();
        }
    })
}