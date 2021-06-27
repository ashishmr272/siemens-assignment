import { Employee } from "../models/employee.model";

export const checkIfArrayContainsData = (array: any[]) => {
    return (array && array.length > 0) ? true : false;
}

export const getUpdatedEmployeeList = (employeeList: Employee[], employee: Employee) => {
    const updatedList = [...employeeList];
    updatedList.push(employee);
    return updatedList.sort(sortFunction)
}

export const sortFunction = (a: Employee, b: Employee) => a.id - b.id;