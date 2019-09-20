import { AbstractControl } from '@angular/forms';

export class CustoValidators {
  static emailDomain(domainName: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email = control.value;
      const domain = email.substring(email.lastIndexOf('@') + 1);
      if (domain.toLowerCase() === domainName.toLowerCase() || email === '') {
        return null;
      } else {
        return { emailDomain: true };
      }
    };
  }
}
