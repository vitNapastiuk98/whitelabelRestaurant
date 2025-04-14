import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadCvaComponent } from './file-upload-cva.component';

describe('FileUploadCvaComponent', () => {
  let component: FileUploadCvaComponent;
  let fixture: ComponentFixture<FileUploadCvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadCvaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploadCvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
