import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroments/enviroment';
import { Observable } from 'rxjs';
import { Department } from '../Models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

 
  private base = `${environment.apiLocalBaseUrl}/departments`;

  constructor(private http: HttpClient) {}

  list(): Observable<Department[]> {
    return this.http.get<Department[]>(this.base);
  }

  create(model: Department): Observable<Department> {
    return this.http.post<Department>(this.base, model);
  }

  update(id: number, model: Department): Observable<Department> {
    return this.http.put<Department>(`${this.base}/${id}`, model);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
