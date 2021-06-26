import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from 'src/app/models/employee.model';
import { AppConstants } from 'src/app/shared/app-constants';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss']
})
export class AddEditEmployeeComponent implements OnInit {

  employeeDetails!: any;

  form!: FormGroup;

  name = new FormControl('', [Validators.required, Validators.email]);

  constructor(public _dialogRef: MatDialogRef<AddEditEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.type === AppConstants.actionEvent.EDIT) {
      const employeeDetails = data.value;

      this.form = new FormGroup({
        name: new FormControl(employeeDetails.name, Validators.required),
        address: new FormGroup({
          street: new FormControl(employeeDetails.address.street),
          suite: new FormControl(employeeDetails.address.suite),
          city: new FormControl(employeeDetails.address.city),
          zipcode: new FormControl(employeeDetails.address.zipcode),
        }),
        company: new FormGroup({
          name: new FormControl(employeeDetails.company.name),
        })
      });
    } else {
      this.form = new FormGroup({
        name: new FormControl('', Validators.required),
        address: new FormGroup({
          street: new FormControl(''),
          suite: new FormControl(''),
          city: new FormControl(''),
          zipcode: new FormControl(''),
        }),
        company: new FormGroup({
          name: new FormControl(''),
        })
      });
    }
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.form);

  }

}
