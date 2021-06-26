import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/http/employee.service';
import { ActionEvent } from 'src/app/models/action-event.model';
import { Employee } from 'src/app/models/employee.model';
import { AppConstants } from 'src/app/shared/app-constants';
import { AddEditEmployeeComponent } from '../add-edit-employee/add-edit-employee.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  employeeList: Employee[] = [];
  deletedEmployeeList: Employee[] = [];
  maxEmployeeId!: number;

  constructor(private _employeeService: EmployeeService, public _dialog: MatDialog,) { }

  ngOnInit(): void {
    this.getEmployeeList();
  }

  async getEmployeeList() {
    try {
      const employeeList: Employee[] = await this._employeeService.getEmployeeList().toPromise();
      if (employeeList && employeeList.length > 0) {
        this.employeeList = employeeList.sort(e => e.id);
        this.maxEmployeeId = this.employeeList[employeeList.length - 1].id;
      } else {
        this.employeeList = [];
      }
    } catch (error) {

    }
  }

  handleAddClick() {
    this.openModal(AppConstants.actionEvent.ADD);
  }

  handleActionEvent(event: ActionEvent) {
    console.log({ event });
    switch (event.action) {

      case AppConstants.actionEvent.EDIT:
        this.openModal(event.action, event.employee);
        break;

      case AppConstants.actionEvent.DELETE:
        this.employeeList = this.employeeList.filter(e => e.id !== event.employee.id);
        const deletedList = [...this.deletedEmployeeList];
        deletedList.push(event.employee);
        this.deletedEmployeeList = deletedList.sort((a, b) => a.id - b.id);
        break;

      case AppConstants.actionEvent.RESTORE:
        this.deletedEmployeeList = this.deletedEmployeeList.filter(e => e.id !== event.employee.id);
        const empList = [...this.employeeList];
        empList.push(event.employee);
        this.employeeList = empList.sort((a, b) => a.id - b.id);
        break;

      default:
        break;
    }
  }

  openModal(action: string, employee?: Employee) {
    console.log({ action });
    const dialogRef = this._dialog.open(AddEditEmployeeComponent, {
      minWidth: '300px',
      maxWidth: '700px',
      autoFocus: true,
      data: { type: action, value: employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        const emp: Employee = Object.assign({}, employee, result);
        console.log(emp);
        if (action === AppConstants.actionEvent.ADD) {
          emp.id = this.maxEmployeeId + 1;
          const newList = [...this.employeeList];
          newList.push(emp);
          this.employeeList = newList;
        } else if (action === AppConstants.actionEvent.EDIT) {
          const updatedList = JSON.parse(JSON.stringify(this.employeeList));
          let updatedEmp = updatedList.find((e: { id: number; }) => e.id === emp.id);
          updatedEmp = Object.assign(updatedEmp, emp);
          console.log(this.employeeList, updatedList);          
          this.employeeList = updatedList;
        }
      }
    });
  }

}
