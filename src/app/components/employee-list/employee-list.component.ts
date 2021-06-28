import {
  AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input,
  OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, withLatestFrom } from 'rxjs/operators';
import { ActionEvent } from 'src/app/models/action-event.model';
import { Employee } from 'src/app/models/employee.model';
import { AppConstants } from 'src/app/shared/app-constants';
import { uniqueValue, unsubscribe } from 'src/app/shared/functions';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush //To update only in case of input value change
})

export class EmployeeListComponent implements OnInit, OnChanges, OnDestroy {

  displayedColumns: string[] = ['name', 'address', 'company', 'action'];
  dataSource!: MatTableDataSource<any>;
  actions: any[] = [];

  filteredNameOptions!: Observable<string[]>;
  filteredCompanyOptions!: Observable<string[]>;
  filteredAddressOptions!: Observable<string[]>;
  nameControl = new FormControl;
  addressControl = new FormControl;
  companyControl = new FormControl;

  @ViewChild(MatSort) sort!: MatSort;

  @Input() employeeList: Employee[] = [];
  @Input() listType = '';
  @Output() actionEvent = new EventEmitter<ActionEvent>();
  subsName: any;
  subsAddress: any;
  subsCompany: any;

  constructor() { }

  ngOnChanges(change: SimpleChanges) {

    /**
     * Check based on SimpleChange
     */
    if (change['employeeList']) {
      this.createGridData();
    }
    if (change['listType']) {
      this.actions = AppConstants.actions.get(this.listType);
    }
  }

  ngOnInit(): void {

    /**
     * Filter Criteria for Data Grid
     */
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) ||
        data.address.toLowerCase().includes(filter) ||
        data.company.toLowerCase().includes(filter);
    };

    /**
     * Update Filter Options
     */
    this.filterOptions();

    /**
     * Subscribe to Autocomplete selection value to filter Data Grid
     */
    this.subsName = this.filteredNameOptions.subscribe((value) => {
      this.filterGrid(value);
    });
    this.subsAddress = this.filteredAddressOptions.subscribe((value) => {
      this.filterGrid(value);
    });
    this.subsCompany = this.filteredCompanyOptions.subscribe((value) => {
      this.filterGrid(value);
    })
  }

  /**
   * Populate Grid Values
   */
  createGridData() {
    const dataSourceEmployeeList: any = [];
    this.employeeList.forEach((emp) => {
      const newEmp = {
        id: emp.id,
        name: emp.name,
        address: emp.address.street + ', ' + emp.address.suite + ', ' + emp.address.city + ', ' + emp.address.zipcode,
        company: emp.company.name
      };
      dataSourceEmployeeList.push(newEmp);
    });
    this.dataSource = new MatTableDataSource(dataSourceEmployeeList);
    this.dataSource.sort = this.sort;
  }

  /**
   * Filter Data Grid based on passed value
   */
  filterGrid(value: any) {
    if (value && value.length === 1) {
      this.dataSource.filter = value[0].trim().toLowerCase();
    }
  }

  /**
   * Used to populate Autocomplete Options
   */
  filterOptions() {
    this.filteredNameOptions = this.nameControl.valueChanges.pipe(
      map(name => name ? this.filterNameAutoComplete(name) : this.dataSource.data.slice().map(a => a.name))
    );
    this.filteredAddressOptions = this.addressControl.valueChanges.pipe(
      map(street => street ? this.filterAddressAutoComplete(street) : this.dataSource.data.slice().map(a => a.address))
    );
    this.filteredCompanyOptions = this.companyControl.valueChanges.pipe(
      map(name => name ? this.filterCompanyAutoComplete(name) : this.dataSource.data.slice().map(a => a.company))
    );
  }


  filterNameAutoComplete(value: string) {
    return this.dataSource.data.filter(option => option.name.toLowerCase().includes(value.toLowerCase())).map(a => a.name).filter(uniqueValue) || null;
  }

  filterAddressAutoComplete(value: string) {
    return this.dataSource.data.filter(option => option.address.toLowerCase().includes(value.toLowerCase())).map(a => a.address).filter(uniqueValue) || null;
  }

  filterCompanyAutoComplete(value: string) {
    return this.dataSource.data.filter(option => option.company.toLowerCase().includes(value.toLowerCase())).map(a => a.company).filter(uniqueValue) || null;
  }

  /**
   * Display Auto complete values
   * @param value :- Column values in autocomplete
   */
  displayAutoComplete(value: string) {
    return value ? value : '';
  }

  /**
   * Handle Click Event
   * @param id :- Employee Id
   * @param action :- Type of Action
   */
  handleActionClick(id: number, action: string) {
    const actionEvent: ActionEvent = { id, action };
    this.actionEvent.emit(actionEvent);
  }

  /**
   * Reset Filters
   */
  handleClearFilter() {
    this.dataSource.filter = '';
    this.nameControl.setValue('');
    this.addressControl.setValue('');
    this.companyControl.setValue('');
  }

  ngOnDestroy() {
    /**
     * UnSubcribing Subscriptions
     */
    unsubscribe([this.subsName, this.subsAddress, this.subsCompany]);
  }
}
