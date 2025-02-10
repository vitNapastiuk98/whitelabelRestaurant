import {Component, signal} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreDirective } from './store.directive';

@Component({
  imports: [
    StoreDirective
  ],
  template: `
    <ng-container *appStore="value as stored">
      <span class="output">{{ stored()}}</span>
    </ng-container>
  `
})
class TestComponent {
  value = 'initial';
}

describe('StoreDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, StoreDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should render the view with the initial value', () => {
    const span = fixture.nativeElement.querySelector('.output');
    expect(span.textContent).toContain('initial');
  });

  it('should update the stored value when the input changes', () => {
    const component = fixture.componentInstance;
    component.value = 'updated';
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('.output');
    expect(span.textContent).toEqual('updated');
  });
});
