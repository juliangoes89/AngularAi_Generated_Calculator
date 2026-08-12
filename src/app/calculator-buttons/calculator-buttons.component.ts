import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-calculator-buttons',
  standalone: true,
  template: `
    <div class="buttons">
      <button class="btn btn-clear span-two" (click)="clear.emit()">AC</button>
      <button class="btn btn-delete" (click)="delete.emit()">DEL</button>
      <button class="btn btn-operator" (click)="operation.emit('/')">÷</button>

      <button class="btn btn-number" (click)="number.emit('1')">1</button>
      <button class="btn btn-number" (click)="number.emit('2')">2</button>
      <button class="btn btn-number" (click)="number.emit('3')">3</button>
      <button class="btn btn-operator" (click)="operation.emit('*')">×</button>

      <button class="btn btn-number" (click)="number.emit('4')">4</button>
      <button class="btn btn-number" (click)="number.emit('5')">5</button>
      <button class="btn btn-number" (click)="number.emit('6')">6</button>
      <button class="btn btn-operator" (click)="operation.emit('+')">+</button>

      <button class="btn btn-number" (click)="number.emit('7')">7</button>
      <button class="btn btn-number" (click)="number.emit('8')">8</button>
      <button class="btn btn-number" (click)="number.emit('9')">9</button>
      <button class="btn btn-operator" (click)="operation.emit('-')">-</button>

      <button class="btn btn-number" (click)="number.emit('.')">.</button>
      <button class="btn btn-number" (click)="number.emit('0')">0</button>
      <button class="btn btn-equals span-two" (click)="equals.emit()">=</button>
    </div>
  `,
  styles: [`
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
      .btn {
        padding: 15px;
        font-size: 1rem;
      }
    }
  `]
})
export class CalculatorButtonsComponent {
  @Output() number = new EventEmitter<string>();
  @Output() operation = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() equals = new EventEmitter<void>();
}
