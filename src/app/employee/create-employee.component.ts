import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  validationMessages = {
    fullName : {
      required : 'Full Name is required.',
      minlength : 'Full Name must be greater than 2 characters.',
      maxlength : 'Full Name must be less than 10 characters.'
    },
    email : {
      required : 'Email is required.'
    },
    phone : {
      required : 'Phone is required.'
    },
    skillName : {
      required : 'Skill Name is required.'
    },
    experienceInYears : {
      required : 'Experience is required.'
    },
    proficiency : {
      required : 'Proficiency is required.'
    }
  };

  formErrors = {
    fullName : '',
    email : '',
    phone : '',
    skillName : '',
    experienceInYears : '',
    proficiency : ''
  };

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
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      email: ['', Validators.required],
      phone: [''],
      skills: this.fb.group({
        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required],
        proficiency: ['', Validators.required]
      })
    });

    this.employeeForm.get('fullName').valueChanges.subscribe( value => {
      console.log(value);
    });
    this.employeeForm.valueChanges.subscribe( data => {
     this.logValidationErrors(this.employeeForm);
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
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
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if ( abstractControl instanceof FormGroup) {
        this.logKeyValuePair(abstractControl);
      } else {
        console.log('key = ' + key + ', value = ' + abstractControl.value);
      }
    });
  }

  logValidationErrors(group: FormGroup = this.employeeForm) {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errrorKey in abstractControl.errors) {
            if (errrorKey) {
              this.formErrors[key] += messages[errrorKey] + ' ';
            }
          }
        }
      }
    });
  }

  onDisableClick()  {
    this.employeeForm.disable();
  }

  // dynamically add validators to form control.
  onContactPreferenceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators([Validators.required]);
    } else {
      phoneControl.clearValidators();
    }

    phoneControl.updateValueAndValidity();  // used to triger validation on control
  }
}
