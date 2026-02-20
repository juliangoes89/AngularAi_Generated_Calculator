import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calculator">
      <div class="display">
        <div class="previous-operand">{{ previousOperand }}</div>
        <div class="current-operand">{{ currentOperand }}</div>
      </div>
      <div class="buttons">
        <button class="btn btn-clear span-two" (click)="clear()">AC</button>
        <button class="btn btn-delete" (click)="delete()">DEL</button>
        <button class="btn btn-operator" (click)="chooseOperation('/')">÷</button>
        
        <button class="btn btn-number" (click)="appendNumber('1')">1</button>
        <button class="btn btn-number" (click)="appendNumber('2')">2</button>
        <button class="btn btn-number" (click)="appendNumber('3')">3</button>
        <button class="btn btn-operator" (click)="chooseOperation('*')">×</button>
        
        <button class="btn btn-number" (click)="appendNumber('4')">4</button>
        <button class="btn btn-number" (click)="appendNumber('5')">5</button>
        <button class="btn btn-number" (click)="appendNumber('6')">6</button>
        <button class="btn btn-operator" (click)="chooseOperation('+')">+</button>
        
        <button class="btn btn-number" (click)="appendNumber('7')">7</button>
        <button class="btn btn-number" (click)="appendNumber('8')">8</button>
        <button class="btn btn-number" (click)="appendNumber('9')">9</button>
        <button class="btn btn-operator" (click)="chooseOperation('-')">-</button>
        
        <button class="btn btn-number" (click)="appendNumber('.')">.</button>
        <button class="btn btn-number" (click)="appendNumber('0')">0</button>
        <button class="btn btn-equals span-two" (click)="compute()">=</button>
      </div>
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

    .display {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      min-height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      text-align: right;
      word-wrap: break-word;
      word-break: break-all;
    }

    .previous-operand {
      color: rgba(255, 255, 255, 0.75);
      font-size: 1.2rem;
      margin-bottom: 5px;
    }

    .current-operand {
      color: white;
      font-size: 2rem;
      font-weight: bold;
    }

    .buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
    }

    .btn {
      padding: 20px;
      font-size: 1.2rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: bold;
      outline: none;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .btn:active {
      transform: translateY(0);
    }

    .btn-number {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .btn-number:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .btn-operator {
      background: rgba(255, 159, 67, 0.8);
      color: white;
    }

    .btn-operator:hover {
      background: rgba(255, 159, 67, 1);
    }

    .btn-clear {
      background: rgba(231, 76, 60, 0.8);
      color: white;
    }

    .btn-clear:hover {
      background: rgba(231, 76, 60, 1);
    }

    .btn-delete {
      background: rgba(155, 89, 182, 0.8);
      color: white;
    }

    .btn-delete:hover {
      background: rgba(155, 89, 182, 1);
    }

    .btn-equals {
      background: rgba(46, 204, 113, 0.8);
      color: white;
    }

    .btn-equals:hover {
      background: rgba(46, 204, 113, 1);
    }

    .span-two {
      grid-column: span 2;
    }

    @media (max-width: 480px) {
      .calculator {
        padding: 20px;
        margin: 10px;
      }
      
      .btn {
        padding: 15px;
        font-size: 1rem;
      }
      
      .current-operand {
        font-size: 1.5rem;
      }
      
      .previous-operand {
        font-size: 1rem;
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
    if (this.previousOperand === '') {
      this.previousOperand = this.currentOperand;
    } else if (!this.waitingForOperand) {
      this.compute();
    }

    this.operation = nextOperation;
    this.waitingForOperand = true;
  }

  compute(): void {
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