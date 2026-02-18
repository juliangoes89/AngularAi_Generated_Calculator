import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the calculator component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.currentOperand).toBe('0');
      expect(component.previousOperand).toBe('');
      expect(component.operation).toBeNull();
      expect(component.waitingForOperand).toBe(false);
    });

    it('should render calculator UI elements', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      expect(compiled.querySelector('.calculator')).toBeTruthy();
      expect(compiled.querySelector('.display')).toBeTruthy();
      expect(compiled.querySelector('.current-operand')?.textContent).toBe('0');
      expect(compiled.querySelector('.previous-operand')?.textContent).toBe('');
    });

    it('should render all calculator buttons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('.btn');
      
      expect(buttons.length).toBe(18); // All calculator buttons (AC, DEL, 4 operators, 10 digits, ., =)
      
      // Check specific buttons exist
      expect(compiled.querySelector('.btn-clear')?.textContent).toBe('AC');
      expect(compiled.querySelector('.btn-delete')?.textContent).toBe('DEL');
      expect(compiled.querySelector('.btn-equals')?.textContent).toBe('=');
    });
  });

  describe('Number Input', () => {
    it('should append single digits correctly', () => {
      component.appendNumber('5');
      expect(component.currentOperand).toBe('5');
      
      component.appendNumber('3');
      expect(component.currentOperand).toBe('53');
    });

    it('should replace initial zero with first digit', () => {
      expect(component.currentOperand).toBe('0');
      
      component.appendNumber('7');
      expect(component.currentOperand).toBe('7');
    });

    it('should allow decimal point input', () => {
      component.appendNumber('3');
      component.appendNumber('.');
      component.appendNumber('1');
      component.appendNumber('4');
      
      expect(component.currentOperand).toBe('3.14');
    });

    it('should prevent multiple decimal points', () => {
      component.appendNumber('3');
      component.appendNumber('.');
      component.appendNumber('1');
      component.appendNumber('.'); // Should be ignored
      component.appendNumber('4');
      
      expect(component.currentOperand).toBe('3.14');
    });

    it('should allow decimal point as first character', () => {
      component.appendNumber('.');
      expect(component.currentOperand).toBe('0.');
      
      component.appendNumber('5');
      expect(component.currentOperand).toBe('0.5');
    });

    it('should replace operand when waiting for new operand', () => {
      component.waitingForOperand = true;
      component.currentOperand = '10';
      
      component.appendNumber('5');
      
      expect(component.currentOperand).toBe('5');
      expect(component.waitingForOperand).toBe(false);
    });
  });

  describe('Clear Functionality', () => {
    it('should reset all values when clear is called', () => {
      // Set some values
      component.currentOperand = '123';
      component.previousOperand = '456';
      component.operation = '+';
      component.waitingForOperand = true;
      
      component.clear();
      
      expect(component.currentOperand).toBe('0');
      expect(component.previousOperand).toBe('');
      expect(component.operation).toBeNull();
      expect(component.waitingForOperand).toBe(false);
    });

    it('should trigger clear when AC button is clicked', () => {
      spyOn(component, 'clear');
      
      const clearButton = fixture.debugElement.query(By.css('.btn-clear'));
      clearButton.nativeElement.click();
      
      expect(component.clear).toHaveBeenCalled();
    });
  });

  describe('Delete Functionality', () => {
    it('should remove last digit from multi-digit number', () => {
      component.currentOperand = '123';
      
      component.delete();
      
      expect(component.currentOperand).toBe('12');
    });

    it('should set to zero when deleting from single digit', () => {
      component.currentOperand = '5';
      
      component.delete();
      
      expect(component.currentOperand).toBe('0');
    });

    it('should set to zero when deleting from zero', () => {
      component.currentOperand = '0';
      
      component.delete();
      
      expect(component.currentOperand).toBe('0');
    });

    it('should handle decimal numbers correctly', () => {
      component.currentOperand = '12.34';
      
      component.delete();
      expect(component.currentOperand).toBe('12.3');
      
      component.delete();
      expect(component.currentOperand).toBe('12.');
      
      component.delete();
      expect(component.currentOperand).toBe('12');
    });

    it('should trigger delete when DEL button is clicked', () => {
      spyOn(component, 'delete');
      
      const deleteButton = fixture.debugElement.query(By.css('.btn-delete'));
      deleteButton.nativeElement.click();
      
      expect(component.delete).toHaveBeenCalled();
    });
  });

  describe('Operation Selection', () => {
    it('should set operation and prepare for next operand', () => {
      component.currentOperand = '10';
      
      component.chooseOperation('+');
      
      expect(component.operation).toBe('+');
      expect(component.previousOperand).toBe('10');
      expect(component.waitingForOperand).toBe(true);
    });

    it('should compute previous operation when chaining operations', () => {
      component.currentOperand = '10';
      component.chooseOperation('+');
      
      component.currentOperand = '5';
      component.waitingForOperand = false;
      component.chooseOperation('*');
      
      expect(component.currentOperand).toBe('15'); // 10 + 5
      expect(component.operation).toBe('*');
      expect(component.waitingForOperand).toBe(true);
    });

    it('should not compute when already waiting for operand', () => {
      component.currentOperand = '10';
      component.chooseOperation('+');
      
      component.chooseOperation('-'); // Change operation without entering new number
      
      expect(component.operation).toBe('-');
      expect(component.previousOperand).toBe('10');
    });
  });

  describe('Arithmetic Calculations', () => {
    beforeEach(() => {
      component.clear(); // Start fresh for each test
    });

    it('should perform addition correctly', () => {
      component.currentOperand = '10';
      component.chooseOperation('+');
      component.currentOperand = '5';
      
      component.compute();
      
      expect(component.currentOperand).toBe('15');
      expect(component.previousOperand).toBe('');
      expect(component.operation).toBeNull();
    });

    it('should perform subtraction correctly', () => {
      component.currentOperand = '10';
      component.chooseOperation('-');
      component.currentOperand = '3';
      
      component.compute();
      
      expect(component.currentOperand).toBe('7');
    });

    it('should perform multiplication correctly', () => {
      component.currentOperand = '6';
      component.chooseOperation('*');
      component.currentOperand = '7';
      
      component.compute();
      
      expect(component.currentOperand).toBe('42');
    });

    it('should perform division correctly', () => {
      component.currentOperand = '20';
      component.chooseOperation('/');
      component.currentOperand = '4';
      
      component.compute();
      
      expect(component.currentOperand).toBe('5');
    });

    it('should handle decimal calculations correctly', () => {
      component.currentOperand = '1.5';
      component.chooseOperation('+');
      component.currentOperand = '2.7';
      
      component.compute();
      
      expect(parseFloat(component.currentOperand)).toBeCloseTo(4.2, 5);
    });

    it('should handle floating point precision', () => {
      component.currentOperand = '0.1';
      component.chooseOperation('+');
      component.currentOperand = '0.2';
      
      component.compute();
      
      expect(parseFloat(component.currentOperand)).toBeCloseTo(0.3, 8);
    });
  });

  describe('Error Handling', () => {
    it('should handle division by zero', () => {
      component.currentOperand = '10';
      component.chooseOperation('/');
      component.currentOperand = '0';
      
      component.compute();
      
      expect(component.currentOperand).toBe('Error');
      expect(component.previousOperand).toBe('');
      expect(component.operation).toBeNull();
      expect(component.waitingForOperand).toBe(true);
    });

    it('should handle invalid operations gracefully', () => {
      component.currentOperand = '10';
      component.previousOperand = '5';
      component.operation = 'invalid' as any;
      
      component.compute();
      
      // Should not change anything for invalid operations
      expect(component.currentOperand).toBe('10');
      expect(component.previousOperand).toBe('5');
    });

    it('should handle NaN inputs', () => {
      component.previousOperand = 'invalid';
      component.currentOperand = '10';
      component.operation = '+';
      
      component.compute();
      
      // Should not change anything when inputs are invalid
      expect(component.currentOperand).toBe('10');
    });
  });

  describe('Number Formatting', () => {
    it('should format large numbers using exponential notation', () => {
      const largeNumber = 1000000000; // > 999999999
      const result = component['formatNumber'](largeNumber);
      
      expect(result).toBe('1.000000e+9');
    });

    it('should format very small numbers using exponential notation', () => {
      const smallNumber = 0.0000001; // < 0.000001
      const result = component['formatNumber'](smallNumber);
      
      expect(result).toBe('1.000000e-7');
    });

    it('should return Error for Infinity', () => {
      expect(component['formatNumber'](Infinity)).toBe('Error');
      expect(component['formatNumber'](-Infinity)).toBe('Error');
    });

    it('should return Error for NaN', () => {
      expect(component['formatNumber'](NaN)).toBe('Error');
    });

    it('should handle normal numbers correctly', () => {
      expect(component['formatNumber'](123.456)).toBe('123.456');
      expect(component['formatNumber'](0)).toBe('0');
      expect(component['formatNumber'](-42)).toBe('-42');
    });

    it('should round numbers to prevent floating point errors', () => {
      const result = component['formatNumber'](0.30000000000000004);
      expect(result).toBe('0.3');
    });
  });

  describe('UI Button Interactions', () => {
    it('should call appendNumber when number buttons are clicked', () => {
      spyOn(component, 'appendNumber');
      
      const numberButton = fixture.debugElement.query(By.css('button[class*="btn-number"]'));
      numberButton.nativeElement.click();
      
      expect(component.appendNumber).toHaveBeenCalled();
    });

    it('should call chooseOperation when operator buttons are clicked', () => {
      spyOn(component, 'chooseOperation');
      
      const operatorButton = fixture.debugElement.query(By.css('button[class*="btn-operator"]'));
      operatorButton.nativeElement.click();
      
      expect(component.chooseOperation).toHaveBeenCalled();
    });

    it('should call compute when equals button is clicked', () => {
      spyOn(component, 'compute');
      
      const equalsButton = fixture.debugElement.query(By.css('.btn-equals'));
      equalsButton.nativeElement.click();
      
      expect(component.compute).toHaveBeenCalled();
    });

    it('should update display when currentOperand changes', () => {
      component.currentOperand = '123';
      fixture.detectChanges();
      
      const displayElement = fixture.debugElement.query(By.css('.current-operand'));
      expect(displayElement.nativeElement.textContent).toBe('123');
    });

    it('should update display when previousOperand changes', () => {
      component.previousOperand = '456';
      fixture.detectChanges();
      
      const displayElement = fixture.debugElement.query(By.css('.previous-operand'));
      expect(displayElement.nativeElement.textContent).toBe('456');
    });
  });

  describe('Complex Calculator Operations', () => {
    it('should handle simple operation chaining', () => {
      // Test simple case: 10 + 5 = 15
      component.clear();
      component.currentOperand = '10';
      component.chooseOperation('+');
      component.appendNumber('5');
      component.compute();
      
      expect(component.currentOperand).toBe('15');
    });

    it('should handle consecutive equals operations', () => {
      component.currentOperand = '10';
      component.chooseOperation('+');
      component.appendNumber('5');
      component.compute();
      
      expect(component.currentOperand).toBe('15');
      
      // Pressing equals again should not change anything since operation is cleared
      component.compute();
      expect(component.currentOperand).toBe('15');
    });

    it('should handle consecutive equals operations', () => {
      component.currentOperand = '10';
      component.chooseOperation('+');
      component.currentOperand = '5';
      component.compute();
      
      expect(component.currentOperand).toBe('15');
      
      // Pressing equals again should not change anything
      component.compute();
      expect(component.currentOperand).toBe('15');
    });

    it('should reset properly after error', () => {
      // Cause an error
      component.currentOperand = '10';
      component.chooseOperation('/');
      component.currentOperand = '0';
      component.compute();
      
      expect(component.currentOperand).toBe('Error');
      
      // Should be able to start fresh
      component.clear();
      component.appendNumber('5');
      expect(component.currentOperand).toBe('5');
    });
  });
});