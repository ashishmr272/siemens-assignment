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
  filterValue = '';
  myControl = new FormControl();
  filteredOptions!: Observable<Employee[]>;

  constructor(private _employeeService: EmployeeService, public _dialog: MatDialog,) { }

  ngOnInit(): void {
    this.getEmployeeList();
  }

  async getEmployeeList() {
    try {
      const employeeList: Employee[] = await this._employeeService.getEmployeeList().toPromise();
      if (checkIfArrayContainsData(employeeList)) {
        this.employeeList = employeeList.sort(sortFunction);
        this.maxEmployeeId = this.employeeList[employeeList.length - 1].id;

        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.employeeList.slice()),
          );

        this.filteredOptions.subscribe((value) => {
          console.log('eee', value);

          if (value && value.length === 1) {

            this.filterValue = value[0].name;
          }
          if (value && value.length === this.employeeList.length) {
            this.filterValue = '';
          }
        })

      } else {
        this.employeeList = [];
      }
    } catch (error) {

    }
  }

  displayFn(user: Employee): string {
    console.log('entered 1', user);

    return user && user.name ? user.name : '';
  }

  private _filter(name: string): Employee[] {
    console.log('entered 2', name);
    const filterValue = name.toLowerCase();
    // this.filterValue = filterValue;
    return this.employeeList.filter(option => option.name.toLowerCase().includes(filterValue));
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
        this.deletedEmployeeList = getUpdatedEmployeeList(this.deletedEmployeeList, event.employee);
        break;

      case AppConstants.actionEvent.RESTORE:
        this.deletedEmployeeList = this.deletedEmployeeList.filter(e => e.id !== event.employee.id);
        this.employeeList = getUpdatedEmployeeList(this.employeeList, event.employee);
        break;

      default:
        break;
    }
  }

  updateAddedEmployeeList(emp: Employee) {
    emp.id = this.maxEmployeeId + 1;
    this.employeeList = getUpdatedEmployeeList(this.employeeList, emp);
  }

  updateEditedEmployeeList(emp: Employee) {
    const updatedList = JSON.parse(JSON.stringify(this.employeeList));
    let updatedEmp = updatedList.find((e: { id: number; }) => e.id === emp.id);
    updatedEmp = Object.assign(updatedEmp, emp);
    this.employeeList = updatedList;
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
