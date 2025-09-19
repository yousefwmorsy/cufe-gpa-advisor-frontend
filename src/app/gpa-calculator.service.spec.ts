import { TestBed } from '@angular/core/testing';
import { GpaCalculatorService } from './gpa-calculator.service';

const transcript_terms = [
  {"name":"Fall","year":"2023","courses":[{"name":"Chemistry for Engineers","credits":2,"grade":"A-","gpa":3.7},{"name":"Engineering Mechanics- Dynamics","credits":3,"grade":"A-","gpa":3.7},{"name":"Critical and Creative Thinking","credits":2,"grade":"A","gpa":4},{"name":"Proficiency and Capacity Building","credits":1,"grade":"A+","gpa":4},{"name":"Information Technology","credits":2,"grade":"A+","gpa":4},{"name":"Calculus I","credits":3,"grade":"A+","gpa":4},{"name":"Mechanical Properties of Matter and Thermodynamics","credits":3,"grade":"B+","gpa":3.3},{"name":"Electricity and Magnetism","credits":3,"grade":"B+","gpa":3.3}]},
  {"name":"Spring","year":"2024","courses":[{"name":"Programming Techniques","credits":3,"grade":"A","gpa":4},{"name":"Engineering Mechanics - Statics","credits":2,"grade":"B","gpa":3},{"name":"Societal Issues","credits":2,"grade":"A","gpa":4},{"name":"Engineering Graphics","credits":3,"grade":"A","gpa":4},{"name":"Calculus 2","credits":3,"grade":"A-","gpa":3.7},{"name":"Discrete Mathematics","credits":3,"grade":"A","gpa":4},{"name":"Modern Physics","credits":3,"grade":"A-","gpa":3.7}]},
  {"name":"Summer","year":"2024","courses":[{"name":"Differential Equations","credits":3,"grade":"A","gpa":4}]},
  {"name":"Fall","year":"2024","courses":[{"name":"Logic Design","credits":3,"grade":"B+","gpa":3.3},{"name":"Data Structures and Algorithms","credits":3,"grade":"A","gpa":4},{"name":"Introduction to Database Management Systems","credits":3,"grade":"A","gpa":4},{"name":"Circuits-1","credits":3,"grade":"A-","gpa":3.7},{"name":"Writing and Presentation Skills","credits":2,"grade":"A+","gpa":4},{"name":"Fundamentals of Economics and Accounting","credits":2,"grade":"A+","gpa":4},{"name":"Linear Algebra and Multivariable Integrals","credits":3,"grade":"A-","gpa":3.7}]},
  {"name":"Spring","year":"2025","courses":[{"name":"Advanced Programming Techniques","credits":2,"grade":"A","gpa":4},{"name":"Algorithms Design and Analysis","credits":3,"grade":"B+","gpa":3.3},{"name":"Operating Systems","credits":3,"grade":"A+","gpa":4},{"name":"Circuits-2","credits":3,"grade":"B+","gpa":3.3},{"name":"Signal Analysis","credits":3,"grade":"A","gpa":4},{"name":"Electrical Power Engineering","credits":3,"grade":"B+","gpa":3.3},{"name":"Fundamentals of Management, Risk and Environment","credits":2,"grade":"A+","gpa":4}]},
  {"name":"Fall","year":"2025","courses":[{"name":"Microprocessor Systems","credits":3,"grade":"A","gpa":4},{"name":"Laboratory","credits":2,"grade":"A","gpa":4},{"name":"Control-1","credits":3,"grade":"A","gpa":4},{"name":"Project Management","credits":2,"grade":"A","gpa":4},{"name":"Numerical Analysis","credits":3,"grade":"A","gpa":4},{"name":"Advanced Probability and Statistics","credits":3,"grade":"A","gpa":4}]}
];

describe('GpaCalculatorService', () => {
  let service: GpaCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpaCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate correct cumulative GPA', () => {
    const cumulativeGPA = service.calculateCumulativeGPA(transcript_terms);
    // You can update the expected value after running the test once
    expect(cumulativeGPA).toBe(3.80); // Example expected value
  });

  it('should calculate correct term GPAs', () => {
    const termGPAs = service.calculateAllTermGPAs(transcript_terms);
    expect(termGPAs.length).toBe(transcript_terms.length);
    // Optionally, check specific term GPAs
    // expect(termGPAs[0]).toBeCloseTo(...)
  });
});
