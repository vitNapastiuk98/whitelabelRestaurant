import { componentTestProviders } from '../../../../../testing/providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentComponent } from './content.component';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: componentTestProviders(),
      imports: [ContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the chosen section as one editable page preview', () => {
    component.selectedIndex.set(2);
    fixture.detectChanges();
    expect(component.selectedContent.label).toBe('Menu');
    expect(fixture.nativeElement.querySelectorAll('.content-item').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.edit-section-button').getAttribute('aria-label')).toBe('Modifica Menù');
  });
});
