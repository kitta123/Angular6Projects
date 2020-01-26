import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, FormArray } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  // Validation messages in Components
  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
    },
    'phone': {
      'required': 'Phone is required.',
    },
    'skillName': {
      'required': 'skill Name is required.',
    },
    'experienceInYears': {
      'required': 'Experience is required.',
    },
    'proficiency': {
      'required': 'Proficiency is required.',
    },
  };

  formErrors = {
    'fullName': '',
    'email': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': ''
  };

  constructor(private fb: FormBuilder) { }

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
      email: ['', Validators.required],
      phone: [],
      // company: new FormControl(),
      // bloodGroup: new FormControl(),
      skills: this.fb.group({
        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required],
        proficiency: ['', Validators.required]
      })
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

  }

// Dynamically Adding and Removing function.
  onContactPreferenceChange(selectValue: string){
    const phoneControl = this.employeeForm.get('phone');
      if (selectValue === 'phone'){
        phoneControl.setValidators(Validators.required);
      }else{
        phoneControl.clearValidators();
      }
      phoneControl.updateValueAndValidity();
    }

  // Loop through all Form Control in ReactiveForms.
  logValidationErrors(group: FormGroup = this.employeeForm): void {
    // console.log(Object.keys(group.controls));
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];

          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
        // abstractControl.markAsDirty();
        // console.log('Key=' + key + 'value=' + abstractControl.value)
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
    console.log(this.employeeForm.value);
  }

}
