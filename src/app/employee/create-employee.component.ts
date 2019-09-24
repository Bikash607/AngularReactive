import { ISkill } from './ISkill';
import { EmployeeService } from './../service/employee.service';
import { IEmployee } from './IEmployee';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { CustoValidators } from '../shared/custom.validators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  panelTitle: string;
  validationMessages = {
    fullName: {
      required: 'Full Name is required.',
      minlength: 'Full Name must be greater than 2 characters.',
      maxlength: 'Full Name must be less than 10 characters.'
    },
    email: {
      required: 'Email is required.',
      emailDomain: 'Email Domain should be pragimtech.com'
    },
    confirmEmail: {
      required: 'Confirm Email is required.',
    },
    phone: {
      required: 'Phone is required.'
    },
    emailGroup: {
      emailMismatch: 'Email and Confirm Email does not Match'
    }
  };

  formErrors = {
  };

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private employeeService: EmployeeService) { }

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
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustoValidators.emailDomain('pragimtech.com')]],
        confirmEmail: ['', Validators.required],
      }, { validator: this.matchEmail }),
      phone: [''],
      skills: this.fb.array([this.addSkillFormGroup()])
    });

    this.employeeForm.get('fullName').valueChanges.subscribe(value => {
      console.log(value);
    });
    this.employeeForm.valueChanges.subscribe(data => {
      this.logValidationErrors(this.employeeForm);
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });

    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id');
      if (id) {
        this.getEmployee(id);
      } else {
        this.panelTitle = 'Create Employee';
      }
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
      if (abstractControl instanceof FormGroup) {
        this.logKeyValuePair(abstractControl);
      } else {
        console.log('key = ' + key + ', value = ' + abstractControl.value);
      }
    });
  }

  logValidationErrors(group: FormGroup = this.employeeForm) {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errrorKey in abstractControl.errors) {
          if (errrorKey) {
            this.formErrors[key] += messages[errrorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  onDisableClick() {
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

  matchEmail(group: AbstractControl): { [key: string]: any } | any {
    const emailControl = group.get('email');
    const confirmEmailControl = group.get('confirmEmail');
    if (emailControl.value === confirmEmailControl.value || (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
      return null;
    } else {
      return { emailMismatch: true };
    }
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  addSkillButtonClick(): void {
    (this.employeeForm.get('skills') as FormArray).push(this.addSkillFormGroup());
  }

  removeSkillButtonClick(skillGroupIndex: number): void {
    const skillsFormArray = this.employeeForm.get('skills') as FormArray;
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
    console.log(this.employeeForm);
  }

  getEmployee(employeeId: number) {
    this.employeeService.getEmployee(employeeId).subscribe((employee) => {
      this.editEmployee(employee);
    });
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    // replace existing control with new control (used to assign form array value)
    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));

    this.panelTitle = 'Edit Employe';
  }

  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach((s) => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    });

    return formArray;
  }
}
