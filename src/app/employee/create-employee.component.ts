import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    /*this.employeeForm = new FormGroup({
      fullName: new FormControl(),
      email: new FormControl(),
      skills: new FormGroup({
        skillName: new FormControl(),
        experienceInYears: new FormControl(),
        proficiency: new FormControl()
      })
    });*/
    // formBuilder is a predefied service used to create form group and control
    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [''],
      skills: this.fb.group({
        skillName: [''],
        experienceInYears: [''],
        proficiency:['intermediate']
      })
    });
  }

  onSubmit(): void {
    console.log(this.employeeForm.value);
    console.log(this.employeeForm);
    console.log(this.employeeForm.controls.fullName.touched);
    console.log(this.employeeForm.get('email').value);
  }

  // patchValue can be used to set partial value where as set value can only be used to set entire form value
  onLoadDataClick() {
    /*this.employeeForm.setValue({
      fullName: 'James',
      email: 'james112@outlook.com',
      skills: {
        skillName: 'Painter',
        experienceInYears: 1,
        proficiency: 'beginer'
      }
    });*/
    this.employeeForm.patchValue({
      fullName: 'James',
      email: 'james112@outlook.com'
    });

    this.logKeyValuePair(this.employeeForm);
  }

  logKeyValuePair(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) =>{
      const abstractControl = group.get(key);
      if( abstractControl instanceof FormGroup) {
        this.logKeyValuePair(abstractControl);
      } else {
        console.log('key = ' + key + ', value = ' + abstractControl.value);
      }
    });
  }

  onDisableClick()  {
    this.employeeForm.disable();
  }
}
