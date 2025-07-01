export class Employee {
    constructor(
        public _id?: any, 
        public EmployeeName: string = "",
        public EmployeeEmail: string = "",
        public EmployeePhone: number = 0,
        public EmployeeAddress: string = "",
        public EmployeeDOB: Date = new Date(), 
        public EmployeePassword: string = ""   
    ) {}
}
