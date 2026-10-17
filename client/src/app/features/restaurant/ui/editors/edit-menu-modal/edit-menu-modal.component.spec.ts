import { componentTestProviders } from '../../../../../../testing/providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMenuModalComponent } from './edit-menu-modal.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('EditMenuModalComponent', () => {
  let component: EditMenuModalComponent;
  let fixture: ComponentFixture<EditMenuModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: componentTestProviders(),
      imports: [EditMenuModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMenuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates a category and saves its items without losing item details', () => {
    component.form.title().value.set('Menu');
    component.addCategory(); component.addItem();
    const item = component.form.categories[0].items[0];
    item.name().value.set('Pasta');
    item.price().value.set(12);
    item.description().value.set('Fresh pasta');
    item.allergens().value.set('Gluten');
    component.save();
    const saved = (TestBed.inject(MatDialogRef).close as jasmine.Spy).calls.mostRecent().args[0];
    expect(saved.categories[0].items[0]).toEqual(jasmine.objectContaining({ name: 'Pasta', price: 12, description: 'Fresh pasta', allergens: 'Gluten' }));
    component.removeCategory(); expect(component.model().categories.length).toBe(0);
  });
});
