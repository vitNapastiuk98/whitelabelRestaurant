import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../data-access/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let response: Subject<void>;
  let login: jasmine.Spy;

  beforeEach(async () => {
    response = new Subject<void>();
    login = jasmine.createSpy('login').and.returnValue(response);
    await TestBed.configureTestingModule({ imports: [LoginComponent], providers: [provideRouter([]),
      { provide: AuthService, useValue: { login } }]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    TestBed.tick();
  });

  it('blocks empty credentials using signal form validation', () => {
    component.submit();
    expect(component.form().invalid()).toBeTrue();
    expect(component.form().touched()).toBeTrue();
    expect(login).not.toHaveBeenCalled();
  });

  it('submits credentials once and waits for authentication before navigating', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    component.model.set({ username: 'owner', password: 'existing-password' });
    component.submit();
    component.submit();
    expect(login).toHaveBeenCalledOnceWith('owner', 'existing-password');
    expect(component.loading()).toBeTrue();
    expect(navigate).not.toHaveBeenCalled();
    response.next();
    expect(component.loading()).toBeFalse();
    expect(navigate).toHaveBeenCalledOnceWith('/admin/content');
  });

  it('retains credentials and permits retry after an authentication failure', () => {
    const credentials = { username: 'owner', password: 'existing-password' };
    component.model.set(credentials);
    component.submit();
    response.error({ error: { message: 'Credenziali non valide.' } });
    expect(component.error()).toBe('Credenziali non valide.');
    expect(component.loading()).toBeFalse();
    expect(component.model()).toEqual(credentials);
    response = new Subject<void>();
    login.and.returnValue(response);
    component.submit();
    expect(login).toHaveBeenCalledTimes(2);
    expect(component.error()).toBe('');
  });
});
