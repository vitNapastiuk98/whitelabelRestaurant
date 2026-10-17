import { Signal, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { componentTestProviders } from '../../../../../testing/providers';
import { FileUploadComponent } from '../../../../shared/ui/file-upload/file-upload.component';
import { EditAboutModalComponent } from './edit-about-modal/edit-about-modal.component';
import { EditHomeModalComponent } from './edit-home-modal/edit-home-modal.component';
import { EditMenuModalComponent } from './edit-menu-modal/edit-menu-modal.component';
import { EditEventsModalComponent } from './edit-events-modal/edit-events-modal.component';
import { EditSpecialtiesModalComponent } from './edit-specialties-modal/edit-specialties-modal.component';

async function createEditor<T>(type: Type<T>, data: unknown) {
  await TestBed.configureTestingModule({
    imports: [type],
    providers: [...componentTestProviders(), { provide: MAT_DIALOG_DATA, useValue: data }],
  }).compileComponents();
  const fixture = TestBed.createComponent(type);
  fixture.detectChanges();
  return fixture;
}

describe('Signal form content editors', () => {
  const cases: { name: string; component: Type<{ close(): void; model: Signal<object> }>; data: object }[] = [
    { name: 'about', component: EditAboutModalComponent, data: { title: 'About', image: '/about.png' } },
    { name: 'home', component: EditHomeModalComponent, data: { items: [{ file: '/hero.png', text1: 'Hero', text2: 'Caption' }] } },
    { name: 'menu', component: EditMenuModalComponent, data: { title: 'Menu', description: '', categories: [{ name: 'Pasta', items: [{ name: 'Spaghetti', price: 12 }] }] } },
    { name: 'events', component: EditEventsModalComponent, data: { title: 'Events', subtitle: '', events: [{ title: 'Jazz', photo: '/jazz.png', description: '', date: '2026-10-17' }] } },
    { name: 'specialties', component: EditSpecialtiesModalComponent, data: { specialties: [{ name: 'Pasta', photo: '/pasta.png', menuLink: '/menu' }] } },
  ];

  for (const testCase of cases) {
    it(`keeps original ${testCase.name} data unchanged when canceling edits`, async () => {
      const data = structuredClone(testCase.data);
      const original = structuredClone(data);
      const fixture = await createEditor(testCase.component, data);
      const input = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
      input.value = 'Edited draft';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(JSON.stringify(fixture.componentInstance.model())).toContain('Edited draft');
      const uploader = fixture.debugElement.query(By.directive(FileUploadComponent));
      if (uploader) {
        (uploader.componentInstance as FileUploadComponent).value.set('data:image/png;base64,aW1hZ2U=');
        fixture.detectChanges();
      }
      fixture.componentInstance.close();
      expect(data).toEqual(original);
      expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalledWith();
    });
  }

  it('validates nested menu fields and preserves source items while adding and removing drafts', async () => {
    const data = { title: 'Menu', description: '', categories: [{ name: 'Pasta', items: [{ name: 'Spaghetti', price: 12, photo: '/pasta.png' }] }] };
    const original = structuredClone(data);
    const fixture = await createEditor(EditMenuModalComponent, data);
    const editor = fixture.componentInstance;
    const first = editor.form.categories[0].items[0];
    first.price().value.set(-1);
    expect(editor.form().invalid()).toBeTrue();
    editor.save();
    expect(TestBed.inject(MatDialogRef).close).not.toHaveBeenCalled();
    first.price().value.set(15);
    editor.addItem();
    expect(editor.form().invalid()).toBeTrue();
    editor.form.categories[0].items[1].name().value.set('Gnocchi');
    expect(editor.form().valid()).toBeTrue();
    editor.removeItem(0);
    expect(editor.model().categories[0].items[0].name).toBe('Gnocchi');
    editor.save();
    expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalledWith({ title: 'Menu', description: '', categories: [{ name: 'Pasta', items: [{ name: 'Gnocchi', price: 0, description: '', allergens: '', photo: undefined }] }] });
    expect(data).toEqual(original);
  });

  it('saves uploaded slide values and removes only the selected slide', async () => {
    const fixture = await createEditor(EditHomeModalComponent, { items: [{ file: '/saved.png', text1: 'One', text2: 'Two' }] });
    const editor = fixture.componentInstance;
    editor.addItem();
    fixture.detectChanges();
    const uploaders = fixture.debugElement.queryAll(By.directive(FileUploadComponent));
    (uploaders[1].componentInstance as FileUploadComponent).value.set('data:image/png;base64,aW1hZ2U=');
    fixture.detectChanges();
    editor.removeItem(0);
    editor.onConfirm();
    expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalledWith([{ file: 'data:image/png;base64,aW1hZ2U=', text1: '', text2: '' }]);
  });

  it('adds, edits and removes events without changing supplied content', async () => {
    const data = { title: 'Events', subtitle: 'Live', events: [{ title: 'Saved', photo: '/saved.png', description: '', date: '' }] };
    const fixture = await createEditor(EditEventsModalComponent, data);
    const editor = fixture.componentInstance;
    editor.addEvent();
    editor.form.events[1].title().value.set('New show');
    editor.removeEvent(0);
    editor.save();
    expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalledWith({ title: 'Events', subtitle: 'Live', events: [{ title: 'New show', photo: null, description: '', date: '' }] });
    expect(data.events[0].title).toBe('Saved');
  });
  it('saves specialty images as plain content without form identity metadata', async () => {
    const data = { specialties: [{ photo: '/pasta.png', name: 'Pasta', menuLink: '/menu' }] };
    const fixture = await createEditor(EditSpecialtiesModalComponent, data);
    fixture.componentInstance.form.specialties[0].name().value.set('Fresh pasta');
    fixture.componentInstance.save();
    expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalledWith({ specialties: [{ photo: '/pasta.png', name: 'Fresh pasta', menuLink: '/menu' }] });
    expect(data.specialties[0].name).toBe('Pasta');
  });

});
