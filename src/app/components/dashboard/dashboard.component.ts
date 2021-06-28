import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeService } from 'src/app/http/employee.service';
import { ActionEvent } from 'src/app/models/action-event.model';
import { Employee } from 'src/app/models/employee.model';
import { AppConstants } from 'src/app/shared/app-constants';
import { checkIfArrayContainsData, getUpdatedEmployeeList, sortFunction } from 'src/app/shared/functions';
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

  /**
   * Get Employee List from API
   */
  async getEmployeeList() {
    try {
      const employeeList: Employee[] = await this._employeeService.getEmployeeList().toPromise();
      if (checkIfArrayContainsData(employeeList)) {
        this.employeeList = employeeList.sort(sortFunction);
        this.maxEmployeeId = this.employeeList[employeeList.length - 1].id;
      } else {
        this.employeeList = [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Handle Add Employee Action
   */
  handleAddClick() {
    this.openModal(AppConstants.actionEvent.ADD);
  }

  /**
   * Handle Edit/Delete/Restore Event
   * @param event :- Action events from child component for Edit/Delete/Restore
   */
  handleActionEvent(event: ActionEvent) {
    switch (event.action) {

      case AppConstants.actionEvent.EDIT:
        this.openModal(event.action, event.id);
        break;

      case AppConstants.actionEvent.DELETE:
        this.deletedEmployeeList = getUpdatedEmployeeList(this.employeeList, this.deletedEmployeeList, event.id);
        this.employeeList = this.employeeList.filter(e => e.id !== event.id);
        break;

      case AppConstants.actionEvent.RESTORE:
        this.employeeList = getUpdatedEmployeeList(this.deletedEmployeeList, this.employeeList, event.id);
        this.deletedEmployeeList = this.deletedEmployeeList.filter(e => e.id !== event.id);
        break;

      default:
        break;
    }
  }

  /**
   * Update Employee List, after adding employee in form
   */
  updateAddedEmployeeList(emp: Employee) {
    emp.id = this.maxEmployeeId + 1;
    const updated = [...this.employeeList];
    updated.push(emp);
    this.employeeList = updated;
  }

   /**
   * Update Employee List, after editing employee in form
   */
  updateEditedEmployeeList(emp: Employee) {
    const updatedList = JSON.parse(JSON.stringify(this.employeeList));
    let updatedEmp = updatedList.find((e: { id: number; }) => e.id === emp.id);
    updatedEmp = Object.assign(updatedEmp, emp);
    this.employeeList = updatedList;
  }

  /**
   * Modal to Added/Edit Employee Details
   */
  openModal(action: string, employeeId?: number) {
    console.log({ action });
    const employee = this.employeeList.find(e => e.id === employeeId);
    const dialogRef = this._dialog.open(AddEditEmployeeComponent, {
      minWidth: '300px',
      maxWidth: '700px',
      autoFocus: true,
      data: { type: action, value: employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);

      /**
       * Check if any employee details where modified in the form
       */
      if (result && !result.pristine) {
        const emp: Employee = Object.assign({}, employee, result.value);
        if (action === AppConstants.actionEvent.ADD) {
          this.updateAddedEmployeeList(emp);
        } else if (action === AppConstants.actionEvent.EDIT) {
          this.updateEditedEmployeeList(emp);
        }
      }
    });
  }

}
