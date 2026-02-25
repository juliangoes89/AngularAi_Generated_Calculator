import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorDisplayComponent } from './calculator-display/calculator-display.component';
import { CalculatorButtonsComponent } from './calculator-buttons/calculator-buttons.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CalculatorDisplayComponent, CalculatorButtonsComponent],
  template: `
    <div class="calculator">
      <app-calculator-display
        [currentOperand]="currentOperand"
        [previousOperand]="previousOperand">
      </app-calculator-display>
      <app-calculator-buttons
        (number)="appendNumber($event)"
        (operation)="chooseOperation($event)"
        (clear)="clear()"
        (delete)="delete()"
        (equals)="compute()">
      </app-calculator-buttons>
    </div>
  `,
  styles: [`
    .calculator {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
      border: 1px solid rgba(255, 255, 255, 0.18);
      max-width: 400px;
      width: 100%;
    }

    @media (max-width: 480px) {
      .calculator {
        padding: 20px;
        margin: 10px;
      }
    }
  `]
})
export class AppComponent {
  currentOperand = '0';
  previousOperand = '';
  operation: string | null = null;
  waitingForOperand = false;

  clear(): void {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = null;
    this.waitingForOperand = false;
  }

  delete(): void {
    if (this.currentOperand.length > 1) {
      this.currentOperand = this.currentOperand.slice(0, -1);
    } else {
      this.currentOperand = '0';
    }
  }

  appendNumber(number: string): void {
    if (this.waitingForOperand) {
      this.currentOperand = number;
      this.waitingForOperand = false;
    } else {
      if (number === '.' && this.currentOperand.includes('.')) {
        return;
      }
      this.currentOperand = this.currentOperand === '0' && number !== '.' 
        ? number 
        : this.currentOperand + number;
    }
  }

  chooseOperation(nextOperation: string): void {
    if (this.previousOperand !== '' && !this.waitingForOperand) {
      this.compute();
    }

    this.previousOperand = this.currentOperand;
    this.operation = nextOperation;
    this.waitingForOperand = true;
  }

  compute(): void {
    // No operation pending (e.g. repeated "=" press) — nothing to do
    if (this.operation === null) {
      return;
    }

    // "=" pressed without a second operand — show the first operand unchanged
    if (this.waitingForOperand) {
      this.currentOperand = this.previousOperand;
      this.previousOperand = '';
      this.operation = null;
      return;
    }

    let result: number;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) {
      return;
    }

    switch (this.operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          this.currentOperand = 'Error';
          this.previousOperand = '';
          this.operation = null;
          this.waitingForOperand = true;
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = this.formatNumber(result);
    this.previousOperand = '';
    this.operation = null;
    this.waitingForOperand = true;
  }

  private formatNumber(num: number): string {
    if (num === Infinity || num === -Infinity || isNaN(num)) {
      return 'Error';
    }
    
    // Handle very large or very small numbers
    if (Math.abs(num) > 999999999 || (Math.abs(num) < 0.000001 && num !== 0)) {
      return num.toExponential(6);
    }
    
    // Round to prevent floating point errors
    const rounded = Math.round(num * 100000000) / 100000000;
    return rounded.toString();
  }
}