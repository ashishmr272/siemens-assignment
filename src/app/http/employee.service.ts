import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private getEmployeeListUrl!: string;

  constructor(private _http: HttpClient) {
    this.getEmployeeListUrl = environment.GET_EMPLOYEE_LIST_EP;
  }

  getEmployeeList(): Observable<Employee[]> {
    return this._http.get<Employee[]>(this.getEmployeeListUrl);
  }
}
