import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from 'src/app/http/employee.service';
import { ActionEvent } from 'src/app/models/action-event.model';
import { Employee } from 'src/app/models/employee.model';
import { AppConstants } from 'src/app/shared/app-constants';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent implements OnInit, OnChanges {

  displayedColumns: string[] = ['name', 'address', 'company', 'action'];
  dataSource!: MatTableDataSource<Employee>;
  actions: any[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  @Input() employeeList: Employee[] = [];
  @Input() listType = '';

  @Output() actionEvent = new EventEmitter<ActionEvent>();

  constructor() { }

  ngOnChanges(change: SimpleChanges) {

    console.log({ change });
    if (change['employeeList']) {
      this.dataSource = new MatTableDataSource(this.employeeList);
      this.dataSource.sort = this.sort;
    }
    if (change['listType']) {
      this.actions = AppConstants.actions.get(this.listType);
    }

  }

  ngOnInit(): void {
    console.log('onint');

  }

  handleActionClick(employee: Employee, action: string) {
    const actionEvent: ActionEvent = { employee, action };
    this.actionEvent.emit(actionEvent);
  }
}
