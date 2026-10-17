import { componentTestProviders } from '../../../../../testing/providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsComponent } from './contacts.component';
import { HttpTestingController } from '@angular/common/http/testing';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: componentTestProviders(),
      imports: [ContactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends the message and waits for acceptance', () => {
    component.form.fullName().value.set('Guest'); component.form.userEmail().value.set('guest@example.com');
    component.form.userPhone().value.set('1234567'); component.form.message().value.set('Hello'); component.form.consent().value.set(true);
    component.onSubmit(); expect(component.contactState()).toBe('loading');
    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne('/api/messages'); expect(request.request.body.message).toBe('Hello');
    request.flush({ id: 'message' }); expect(component.contactState()).toBe('success'); http.verify();
  });
  it('validates email and consent without sending incomplete messages', () => {
    component.model.set({ fullName: 'Guest', userEmail: 'invalid', userPhone: '1234567', message: 'Hello', consent: true });
    component.onSubmit();
    const http = TestBed.inject(HttpTestingController);
    http.expectNone('/api/messages');
    expect(component.form.userEmail().invalid()).toBeTrue();
    component.form.userEmail().value.set('guest@example.com');
    component.form.consent().value.set(false);
    component.onSubmit();
    http.expectNone('/api/messages');
    expect(component.form.consent().invalid()).toBeTrue();
    http.verify();
  });

  it('retains an immutable draft on failure and allows retry and reset', () => {
    const draft = { fullName: 'Guest', userEmail: 'guest@example.com', userPhone: '1234567', message: 'Hello', consent: true };
    component.model.set(draft);
    component.form.message().value.set('Updated');
    expect(draft.message).toBe('Hello');
    component.onSubmit();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/messages').flush({ message: 'Try again' }, { status: 503, statusText: 'Unavailable' });
    expect(component.model().message).toBe('Updated');
    expect(component.error()).toBe('Try again');
    expect(component.contactState()).toBe('idle');
    component.onSubmit();
    http.expectOne('/api/messages').flush({ id: 'message' });
    expect(component.contactState()).toBe('success');
    component.reset();
    expect(component.model().message).toBe('');
    expect(component.model().consent).toBeFalse();
    expect(component.form().touched()).toBeFalse();
    http.verify();
  });

});
