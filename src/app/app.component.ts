import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { employee } from './model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  employeeForm!: FormGroup;
  showForm: boolean = false;
  employeeArr: employee[] = [
    { id: 1, name: 'Test', job_title: 'Manager', age: 30, start_date: '2023-01-01', end_date: '', isCurrentlyWorking: true },
  ];
  filteredEmployeeArr: employee[] = [];
  tableColumns: Array<string> = ['#', 'Name', 'Job Title', 'Age', 'Start Date', 'End Date', 'Action'];
  filterObj: any = {
    name: '',
    job_title: '',
    age: null,
    start_date: '',
    end_date: ''
  }
  jobTitleArray: Array<string> = ["Manager", "Tech Lead", "Software Developer", "Quality Analysis", "UI Designer"]
  toEdit: boolean = false;
  editIndex!: number;
  submitted: boolean = false;
  today: Date = new Date;

  constructor(public fb: FormBuilder, private date: DatePipe) {
    this.filteredEmployeeArr = [...this.employeeArr];
    this.generateForm();
  }

  ngOnInit() { }

  generateForm(data?: employee) {
    this.employeeForm = this.fb.group({
      name: [data ? data.name : '', Validators.required],
      job_title: [data ? data.job_title : null, Validators.required],
      age: [data ? data.age : null, Validators.compose([Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(3)])],
      start_date: [data?.start_date ? this.date.transform(new Date(data.start_date), 'yyyy-MM-dd') : '', Validators.required],
      end_date: [data?.end_date ? this.date.transform(new Date(data.end_date), 'yyyy-MM-dd') : '', Validators.required],
      isCurrentlyWorking: [data ? data.isCurrentlyWorking : false]
    })
    if (data && data?.isCurrentlyWorking) {
      this.employeeForm.get('end_date')?.clearValidators();
      this.employeeForm.get('end_date')?.updateValueAndValidity();
    }
  }

  applyFilter() {
    this.filteredEmployeeArr = [];
    this.filteredEmployeeArr = this.employeeArr.filter((emp: any) => {
      return Object.keys(this.filterObj).every((item: any) => {
        if (this.filterObj[item]?.length) {
          return emp[item].toString().toLowerCase().includes(this.filterObj[item].toString().toLowerCase())
        }
        return true;
      })
    })
  }

  clearFilter() {
    this.filterObj = {
      name: '',
      job_title: '',
      age: null,
      start_date: '',
      end_date: ''
    }
    this.filteredEmployeeArr = [...this.employeeArr];
  }

  deleteRecord(index: number) {
    let final = confirm('Are you sure to delete the selected Employee record!');
    if (final) {
      if (this.employeeArr.length == 1) {
        alert('Last Employee Record. So can"t delete!');
        return;
      }
      this.employeeArr.splice(index, 1);
      this.filteredEmployeeArr = [...this.employeeArr];
    }
  }

  viewEmployee(data: employee, index: number) {
    this.generateForm(data);
    this.showForm = true;
    this.toEdit = true;
    this.editIndex = index;
  }

  cancel() {
    this.employeeForm.reset();
    this.showForm = false;
    this.toEdit = false;
    this.submitted = false;
  }

  changeCurrentlyWorking(event: any) {
    if (event.target.checked) {
      this.employeeForm.get('end_date')?.setValue('');
      this.employeeForm.get('end_date')?.clearValidators();
      this.employeeForm.get('end_date')?.updateValueAndValidity();
    } else {
      this.employeeForm.get('end_date')?.setValidators(Validators.required);
      this.employeeForm.get('end_date')?.updateValueAndValidity();
    }
  }

  save() {
    this.submitted = true;
    if (this.employeeForm.invalid) {
      return;
    }
    if (this.toEdit) {
      this.employeeArr[this.editIndex] = this.employeeForm.value;
      alert('Employee updated Successfuly!');
    } else {
      this.employeeArr.push(this.employeeForm.value);
      alert('Employee created Successfuly!');
    }
    this.filteredEmployeeArr = [...this.employeeArr];
    this.cancel();
  }

}
