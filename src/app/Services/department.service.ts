import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { Department } from '../Models/department';

@Injectable({
    providedIn: 'root'
})
export class DepartmentService {
    private baseUrl = `${environment.apiLocalBaseUrl}/Departments`;

    constructor(private http: HttpClient) { }

    list(): Observable<Department[]> {
        return this.http.get<Department[]>(this.baseUrl);
    }

    add(name: string): Observable<Department> {
        return this.http.post<Department>(this.baseUrl, { name });
    }

    update(id: number, name: string): Observable<Department> {
        return this.http.put<Department>(`${this.baseUrl}/${id}`, { id, name });
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
