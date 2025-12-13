import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';
import { AddressBook } from '../Models/address-book';
@Injectable({
  providedIn: 'root'
})
export class AddressBookService {

 private base = `${environment.apiLocalBaseUrl}/AddressBook`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AddressBook[]> {
    return this.http.get<AddressBook[]>(this.base);
  }

  getById(id: number): Observable<AddressBook> {
    return this.http.get<AddressBook>(`${this.base}/${id}`);
  }

  create(formData: FormData): Observable<any> {
    return this.http.post(this.base, formData);
  }

  update(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.base}/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }

  search(filters: any): Observable<AddressBook[]> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const val = filters[key];
      if (val !== null && val !== '' && val !== undefined) {
        params = params.append(key, val);
      }
    });

    return this.http.get<AddressBook[]>(`${this.base}/search`, { params });
  }

  export(filters: any): Observable<Blob> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const val = filters[key];
      if (val) {
        params = params.append(key, val);
      }
    });

    return this.http.get(`${this.base}/export`, {
      params,
      responseType: 'blob'
    });
  }
}
