import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    stream: () => this.checkStatus()
  })


  /**
   * Estado de la autentificación
   */
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated'
    }

    return 'not-authenticated';
  })


  user = computed<User | null>(() => this._user());
  token = computed(this._token);
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false); //si el rol incluye admin devuelve true, sino false

  /**
   * Función de login
   *
   * @param email
   * @param password
   * @returns
   */
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email: email,
      password: password,
    }).pipe(
      map(resp => this.handleAuthSuccess(resp)), //tap es para efectos secundarios
      catchError((error: any) => this.handleAuthError(error))
    )
  }


  /**
   * Función para resgitrarse
   * @param email
   * @param password
   * @param fullName
   * @returns
   */
  singUp(email: string, password: string, fullName: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, {
      email: email,
      password: password,
      fullName: fullName
    }).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    )
  }

  /**
   * Comprobar si estamos logados
   * @returns
   */
  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logOut();
      return of(false);
    }

    


    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
      //     headers: {
      //      Authorization: `Bearer ${token}`,
      //   }
    }).pipe(
      map(resp => this.handleAuthSuccess(resp)), //tap es para efectos secundarios
      catchError((error: any) => this.handleAuthError(error))
    )

  }


  /**
   * Cerrar sesión
   */
  logOut() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }



  private handleAuthSuccess({ token, user }: AuthResponse) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);
    localStorage.setItem('token', token);

    return true;
  }


  private handleAuthError(error: any) {
    this.logOut();
    return of(false);
  }
}
