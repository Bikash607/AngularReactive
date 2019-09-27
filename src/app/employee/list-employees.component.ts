import { IEmployee } from './IEmployee';
import { EmployeeService } from './../service/employee.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {
  employees: IEmployee[];
  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe((listEmployees) => {
      this.employees = listEmployees;
    },
    (error) => console.log(error));
  }

  editButtonClick(employeeId: number) {
    this.router.navigate(['employee/edit', employeeId]);
  }
}
