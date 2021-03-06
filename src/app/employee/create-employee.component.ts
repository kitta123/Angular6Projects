import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validator';
import { GroupedObservable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: IEmployee;
  pageTitle: string;

  // Validation messages in Components
  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email Domain Should be gmail.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required.',
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email  do not match'
    },
    'phone': {
      'required': 'Phone is required.',
    }
  };

  formErrors = {
  };

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router) { }

  // FormGroup & FormControl in Reactive Forms.

  // ngOnInit() {
  //   this.employeeForm = new FormGroup({
  //     fullName: new FormControl(),
  //     email: new FormControl(),
  //     // company: new FormControl(),
  //     // bloodGroup: new FormControl(),
  //     skills: new FormGroup({
  //       skillName: new FormControl(),
  //       experienceInYears: new FormControl(),
  //       proficiency: new FormControl()
  //     })
  //   });

  // }

  // FormBuilder in Reactive Forms.

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('gmail.com')]],
        confirmEmail: ['', Validators.required],
      }, { validator: matchEmail }),
      phone: [],
      // company: new FormControl(),
      // bloodGroup: new FormControl(),
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });
    
  }

  // Edit Employee Details

  getEmployee(id: number) {
    this.employeeService.getEmployee(id)
      .subscribe(
        (employee: IEmployee) => {
          // Store the employee object returned by the
          // REST API in the employee property
          this.employee = employee;
          this.editEmployee(employee);
        },
        (err: any) => console.log(err)
      );
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
    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }

  // Angular populate formarray
  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    });

    return formArray;
  }

  // Angular dynamic forms. 

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  // Remove dynamically created form controls in angular
  removeSkillButtonClick(skillGroupIndex: number): void {
    const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }

  // Creating formarray of formgroup objects in Angular

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  // Dynamically Adding and Removing function.
  onContactPreferenceChange(selectValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    if (selectValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  // Loop through all Form Control in ReactiveForms.
  logValidationErrors(group: FormGroup = this.employeeForm): void {
    // console.log(Object.keys(group.controls));
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  onLoadDataClick(): void {
    // this.logValidationErrors(this.employeeForm);
    // console.log(this.formErrors);
  }

  // setValue in Reactive Forms.
  // onLoadDataClick(): void{
  //   this.employeeForm.setValue({
  //     fullName: 'karthik',
  //     email: 'kkma3.rymec@gmail.com',
  //     skills: {
  //       skillName:'python',
  //       experienceInYears: 2,
  //       proficiency: 'advanced'
  //     }

  //   });
  // }

  // patchValue in Reactive Forms.
  onLoadDataClick1(): void {
    this.employeeForm.patchValue({
      fullName: 'karthik',
      email: 'kkma3.rymec@gmail.com'
      // skills: {
      //   skillName:'python',
      //   experienceInYears: 2,
      //   proficiency: 'advanced'
      // }

    });
  }

  // Angular FormArray Example.

  // onLoadDataClick2(): void {
  //   const formArray = new FormArray([
  //     new FormControl('Jhon', Validators.required),
  //     new FormGroup({
  //       country: new FormControl('', Validators.required)
  //     }),
  //     new FormArray([])
  //   ]);
  //   console.log(FormArray.length);

  //   for (const control of formArray.controls) {
  //     if (control instanceof FormControl) {
  //       console.log('Control is FormControl');
  //     }
  //     if (control instanceof FormGroup) {
  //       console.log('Control is FormGroup');
  //     }
  //     if (control instanceof FormArray) {
  //       console.log('Control is FormArray');
  //     }
  //   }

  //   const formArray1 = this.fb.array([
  //     new FormControl('Jhon', Validators.required),
  //     new FormControl('IT', Validators.required),
  //     new FormControl('Male', Validators.required)
  //   ]);
  //   formArray1.push(new FormControl('Mark', Validators.required));

  //   const formGroup = this.fb.group([
  //     new FormControl('Jhon', Validators.required),
  //     new FormControl('IT', Validators.required),
  //     new FormControl('Male', Validators.required)
  //   ]);
  //   console.log(formArray1.at(3).value);
  //   console.log(formArray1);
  //   console.log(formGroup);
  // }

  // onSubmit Function in Reactive Forms.
  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();
  
    if (this.employee.id) {
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees']),
        (err: any) => console.log(err)
      );
    } else {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees']),
        (err: any) => console.log(err)
      );
    }
  }

  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

}

// Angular reactive form custom validator with parameters.

// function emailDomain(domainName: string) {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     const email: string = control.value;
//     const domain = email.substring(email.lastIndexOf('@') + 1);
//     if (email === '' || domain.toLowerCase() === domainName.toLowerCase()) {
//       return null;
//     } else {
//       return { 'emailDomain': true };
//     }
//   };
// }

function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if (emailControl.value === confirmEmailControl.value
    || (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
    return null;
  } else {
    return { 'emailMismatch': true };
  }
}