import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroments/enviroment';
import { Observable } from 'rxjs';
import { Job } from '../Models/job';
@Injectable({
  providedIn: 'root'
})
export class JobService {

    private base = `${environment.apiLocalBaseUrl}/jobs`;

  constructor(private http: HttpClient) {}

  list(): Observable<Job[]> {
    return this.http.get<any[]>(this.base);
  }

  create(model: Job): Observable<Job> {
    return this.http.post<Job>(this.base, model);
  }

  update(id: number, model: Job): Observable<Job> {
    return this.http.put<Job>(`${this.base}/${id}`, model);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}

