import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FileUploadComponent] }).compileComponents();
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const selection = (file: File) => ({ target: { files: [file], value: 'file' } } as unknown as Event);

  it('previews an existing signal value', () => {
    fixture.componentRef.setInput('value', '/carbonara.png');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe('/carbonara.png');
  });

  it('rejects unsupported and oversized files without replacing the saved image', () => {
    component.value.set('/carbonara.png');
    for (const file of [new File(['text'], 'file.txt', { type: 'text/plain' }),
      new File([new Uint8Array(1024 * 1024 + 1)], 'large.png', { type: 'image/png' })]) {
      component.onFileSelected(selection(file));
      expect(component.error()).toBeTruthy();
      expect(component.value()).toBe('/carbonara.png');
    }
  });

  it('reads an accepted image into the value model', (done) => {
    component.value.subscribe(value => {
      expect(value).toBe('data:image/png;base64,aW1hZ2U=');
      done();
    });
    component.onFileSelected(selection(new File(['image'], 'image.png', { type: 'image/png' })));
  });

  it('renders an asynchronous read error without replacing the saved image', async () => {
    component.value.set('/saved.png');
    const reader = { readAsDataURL: jasmine.createSpy('read'), onerror: null as unknown as () => void };
    spyOn(window, 'FileReader').and.returnValue(reader as unknown as FileReader);
    component.onFileSelected(selection(new File(['image'], 'image.png', { type: 'image/png' })));
    await new Promise<void>(resolve => queueMicrotask(() => { reader.onerror(); resolve(); }));
    await fixture.whenStable();
    expect(component.value()).toBe('/saved.png');
    expect(component.error()).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Impossibile leggere');
  });

  it('honors disabled state and emits touch on blur', () => {
    const touch = spyOn(component.touch, 'emit');
    fixture.nativeElement.querySelector('[role="button"]').dispatchEvent(new Event('blur'));
    expect(touch).toHaveBeenCalled();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const click = spyOn(component.fileInput.nativeElement, 'click');
    component.onSelectFile();
    component.onFileSelected(selection(new File(['image'], 'image.png', { type: 'image/png' })));
    expect(click).not.toHaveBeenCalled();
    expect(component.value()).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="button"]').tabIndex).toBe(-1);
  });
});
