import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalculatorButtonsComponent } from './calculator-buttons.component';

describe('CalculatorButtonsComponent', () => {
  let component: CalculatorButtonsComponent;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorButtonsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render 18 buttons total', () => {
      const buttons = fixture.debugElement.queryAll(By.css('.btn'));
      expect(buttons.length).toBe(18);
    });

    it('should render AC, DEL and = buttons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.btn-clear')?.textContent?.trim()).toBe('AC');
      expect(compiled.querySelector('.btn-delete')?.textContent?.trim()).toBe('DEL');
      expect(compiled.querySelector('.btn-equals')?.textContent?.trim()).toBe('=');
    });
  });

  describe('Number button emissions', () => {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

    digits.forEach(digit => {
      it(`should emit number "${digit}" when the "${digit}" button is clicked`, () => {
        let emitted: string | undefined;
        component.number.subscribe((v: string) => (emitted = v));

        const buttons = fixture.debugElement.queryAll(By.css('.btn-number'));
        const target = buttons.find((b: any) => b.nativeElement.textContent.trim() === digit);
        expect(target).withContext(`Button "${digit}" not found`).toBeTruthy();
        target.nativeElement.click();

        expect(emitted).toBe(digit);
      });
    });
  });

  describe('Operator button emissions', () => {
    const operators: { label: string; value: string }[] = [
      { label: '÷', value: '/' },
      { label: '×', value: '*' },
      { label: '+', value: '+' },
      { label: '-', value: '-' },
    ];

    operators.forEach(({ label, value }) => {
      it(`should emit operation "${value}" when the "${label}" button is clicked`, () => {
        let emitted: string | undefined;
        component.operation.subscribe((v: string) => (emitted = v));

        const buttons = fixture.debugElement.queryAll(By.css('.btn-operator'));
        const target = buttons.find((b: any) => b.nativeElement.textContent.trim() === label);
        expect(target).withContext(`Operator button "${label}" not found`).toBeTruthy();
        target.nativeElement.click();

        expect(emitted).toBe(value);
      });
    });
  });

  describe('AC button', () => {
    it('should emit clear event when AC is clicked', () => {
      let emitted = false;
      component.clear.subscribe(() => (emitted = true));

      const btn = fixture.debugElement.query(By.css('.btn-clear'));
      btn.nativeElement.click();

      expect(emitted).toBeTrue();
    });
  });

  describe('DEL button', () => {
    it('should emit delete event when DEL is clicked', () => {
      let emitted = false;
      component.delete.subscribe(() => (emitted = true));

      const btn = fixture.debugElement.query(By.css('.btn-delete'));
      btn.nativeElement.click();

      expect(emitted).toBeTrue();
    });
  });

  describe('Equals button', () => {
    it('should emit equals event when = is clicked', () => {
      let emitted = false;
      component.equals.subscribe(() => (emitted = true));

      const btn = fixture.debugElement.query(By.css('.btn-equals'));
      btn.nativeElement.click();

      expect(emitted).toBeTrue();
    });
  });
});
