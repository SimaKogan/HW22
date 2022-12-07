const inputElements = document.querySelectorAll(".form-class [name]");
const informPlace = document.querySelector("#place-form");
const OlAllEmployees = document.querySelector(".allEmployees");
const emplForm = document.getElementById("employee-form");
const sectEmpl = document.querySelector(".section-allEmployees");
const OLemplBySalary = document.querySelector(".emplBySalary");
const sectFilterSalary = document.querySelector(".filterSalary");
const informParag = document.querySelector(".inform-p");

const YEAR_MIN = 1959;
const YEAR_MAX = new Date().getFullYear();
const aCode = "a".charCodeAt();
const zCode = "z".charCodeAt();
const MIN_SALARY = 1000;
const MAX_SALARY = 40000;
const TIME_OF_OUT = 5000;
let FROM_SALARY = MIN_SALARY;
let TO_SALARY = MAX_SALARY;
const RED = "red";
const BLACK = "black";

const company = new Company();
function onSubmit(event) {
    event.preventDefault();
    console.log("submitted");
    const employee = Array.from(inputElements).reduce((res, cur) => {
        res[cur.name] = cur.value;
        return res;
    }, {});
    console.log(employee);
    company.hireEmployee(employee);
}
function onChange(event) {
    let nameElement = event.target.name;
    let elementEvent = event.target;
    switch (nameElement) {
        case "employee_name":
            console.log(elementEvent.value)
            if (!checkisValidName(elementEvent)) {
                errorEvent(event, nameElement);
            }
            break;
        case "email":
            console.log(elementEvent.value)
            if (!checkisValidEmail(elementEvent)) {
                errorEvent(event, nameElement);
            }
            break;
        case "birthDate":
            if (!checkisValidBirthDate(elementEvent)) {
                errorEvent(event, nameElement);
            }
            break;
        case "salary":
            if (!checkisValidSalary(elementEvent)) {
                errorEvent(event, nameElement);
            }
            break;
        case "salaryFrom":
            FROM_SALARY = +elementEvent.value;
            if (checkisValidFromToSalary(FROM_SALARY, TO_SALARY)) {
                outputEmplSalaryFromTo(FROM_SALARY, TO_SALARY);
                informParag.innerHTML = `List of employees with salary from ${FROM_SALARY} to ${TO_SALARY}:`;
            }
            break;
        case "salaryTo":
            TO_SALARY = +elementEvent.value;
            if (checkisValidFromToSalary(FROM_SALARY, TO_SALARY)) {
                outputEmplSalaryFromTo(FROM_SALARY, TO_SALARY);
                informParag.innerHTML = `List of employees with salary from ${FROM_SALARY} to ${TO_SALARY}:`;
            }
            break
    }
}
function errorEvent(event, nameElement) {
    event.target.value = '';
    document.getElementById(`error_${nameElement}`).innerHTML = `*Enter relevant ${nameElement}`;
    timeoutError(nameElement);
}

function timeoutError(nameElement) {
    setTimeout(() => {
        document.getElementById(`error_${nameElement}`).innerHTML = ``;
    }, TIME_OF_OUT)
}
// Validation functions:
function checkisValidName(elementEvent) {
    let arrayName = Array.from(elementEvent.value.toLowerCase());
    return arrayName.every(elem => elem.charCodeAt(0) >= aCode && elem.charCodeAt(0) <= zCode);
}
function checkisValidEmail(elementEvent) {
    let res = false;
    let arrayInput = Array.from(elementEvent.value);
    arrayInput.forEach(elem => {
        let at = "@";
        if (elem === at) {
            res = true;
        }
    })
    return res;
}
function checkisValidBirthDate(elementEvent) {
    let res = true;
    let year = elementEvent.value.slice(0, 4);
    if (year < YEAR_MIN || year > YEAR_MAX) {
        res = false;
    }
    return res;
}
function checkisValidSalary(elementEvent) {
    let res = true;
    if (elementEvent.value < MIN_SALARY || elementEvent.value > MAX_SALARY) {
        res = false;
    }
    return res;
}
function checkisValidFromToSalary(salaryFrom, salaryTo) {
    let res = true;
    if (salaryTo < salaryFrom) {
        informParag.style.color = RED;
        informParag.innerHTML = `*salary "from" must be less salary "to"`;  //`Please enter salary from ${MIN_SALARY} to ${MAX_SALARY} include`;
        res = false;
    } else if (salaryFrom > MAX_SALARY || salaryTo > MAX_SALARY) {
        informParag.style.color = RED;
        informParag.innerHTML = `*salary must be less ${MAX_SALARY} (included)`;
        res = false;
    }
    return res;
}

// object Company ***********
function Company() {
    this.employees = [];
}
Company.prototype.hireEmployee = function (employee) {
    this.employees.push(employee);
}
Company.prototype.getAllEmployees = function () {
    return this.employees;
}
Company.prototype.getEmployeesBySalary = function (salaryFrom, salaryTo) {
    const arrEmplBySalary = this.employees.filter(elem => (elem.salary >= salaryFrom && elem.salary <= salaryTo));
    return arrEmplBySalary.sort((empl, empl1) => empl.salary - empl1.salary);
}

// Active buttons:
function addEmployee() {
    sectEmpl.hidden = true;
    sectFilterSalary.hidden = true;
    informPlace.style.display = "flex";
    OlAllEmployees.hidden = true;
}

function setAllEmployees() {
    sectFilterSalary.hidden = true;
    OlAllEmployees.hidden = false;
    console.log(company.employees);
    OlAllEmployees.innerHTML = addAllEmployee(company.employees);
    informPlace.style.display = "none";
    sectEmpl.hidden = false;
}
function setEmplBySalary() {
    sectFilterSalary.hidden = false;
    OLemplBySalary.hidden = false;
    sectEmpl.hidden = true;
    OlAllEmployees.hidden = true;
    informPlace.style.display = "none";
    outputEmplSalaryFromTo(FROM_SALARY, TO_SALARY);
}

// function values:
function addAllEmployee(employees) {
    const arrEmployees = employees.map(empl =>
        `<li class="employee">Name: ${empl.employee_name} |Birthdate: ${empl.birthDate} |Department: ${empl.department} |Salary: ${empl.salary} |EMAIL: ${empl.email}</li>`
    )
    return arrEmployees.join(' ');
}
function outputEmplSalaryFromTo(salaryFrom, salaryTo) {
    let arrSalary = company.getEmployeesBySalary(salaryFrom, salaryTo);
    OLemplBySalary.innerHTML = addAllEmployee(arrSalary);
    informParag.style.color = BLACK;
    informParag.innerHTML = `List of employees with salary from${FROM_SALARY} to ${TO_SALARY}:`;

}