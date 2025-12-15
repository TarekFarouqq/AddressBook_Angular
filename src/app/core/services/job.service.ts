import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { Job } from '../models/job';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private baseUrl = `${environment.apiLocalBaseUrl}/Jobs`;

    constructor(private http: HttpClient) { }

    list(): Observable<Job[]> {
        return this.http.get<Job[]>(this.baseUrl);
    }

    add(name: string): Observable<Job> {
        return this.http.post<Job>(this.baseUrl, { name });
    }

    update(id: number, name: string): Observable<Job> {
        return this.http.put<Job>(`${this.baseUrl}/${id}`, { name, id });
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
