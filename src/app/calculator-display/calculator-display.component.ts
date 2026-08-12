import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="display">
      <div class="previous-operand">{{ previousOperand }}</div>
      <div class="current-operand">{{ currentOperand }}</div>
    </div>
  `,
  styles: [`
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
  `]
})
export class CalculatorDisplayComponent {
  @Input() currentOperand = '0';
  @Input() previousOperand = '';
}
