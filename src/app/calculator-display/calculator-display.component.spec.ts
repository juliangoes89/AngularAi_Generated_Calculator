import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalculatorDisplayComponent } from './calculator-display.component';

describe('CalculatorDisplayComponent', () => {
  let component: CalculatorDisplayComponent;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorDisplayComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have default input values', () => {
      expect(component.currentOperand).toBe('0');
      expect(component.previousOperand).toBe('');
    });

    it('should render the display container', () => {
      const display = fixture.debugElement.query(By.css('.display'));
      expect(display).toBeTruthy();
    });
  });

  describe('Current Operand Display', () => {
    it('should render the initial currentOperand as "0"', () => {
      const el = fixture.debugElement.query(By.css('.current-operand'));
      expect(el.nativeElement.textContent.trim()).toBe('0');
    });

    it('should update when currentOperand input changes', () => {
      component.currentOperand = '123';
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.current-operand'));
      expect(el.nativeElement.textContent.trim()).toBe('123');
    });

    it('should display Error string', () => {
      component.currentOperand = 'Error';
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.current-operand'));
      expect(el.nativeElement.textContent.trim()).toBe('Error');
    });

    it('should display decimal numbers', () => {
      component.currentOperand = '3.14';
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.current-operand'));
      expect(el.nativeElement.textContent.trim()).toBe('3.14');
    });

    it('should display negative numbers', () => {
      component.currentOperand = '-42';
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.current-operand'));
      expect(el.nativeElement.textContent.trim()).toBe('-42');
    });

    it('should display scientific notation numbers', () => {
      component.currentOperand = '1.000000e+9';
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.current-operand'));
      expect(el.nativeElement.textContent.trim()).toBe('1.000000e+9');
    });
  });

  describe('Previous Operand Display', () => {
    it('should render an empty previousOperand by default', () => {
      const el = fixture.debugElement.query(By.css('.previous-operand'));
      expect(el.nativeElement.textContent.trim()).toBe('');
    });

    it('should update when previousOperand input changes', () => {
      component.previousOperand = '10 +';
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.previous-operand'));
      expect(el.nativeElement.textContent.trim()).toBe('10 +');
    });

    it('should clear when previousOperand is reset to empty string', () => {
      component.previousOperand = '5';
      fixture.detectChanges();

      component.previousOperand = '';
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.previous-operand'));
      expect(el.nativeElement.textContent.trim()).toBe('');
    });
  });
});
