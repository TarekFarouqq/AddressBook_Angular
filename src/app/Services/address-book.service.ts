import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { AddressBook, PaginatedResponse } from '../Models/address-book';

@Injectable({
    providedIn: 'root'
})
export class AddressBookService {
    private baseUrl = `${environment.apiLocalBaseUrl}/AddressBook`;

    constructor(private http: HttpClient) { }

    search(filters: any, page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<AddressBook>> {
        let params = new HttpParams()
            .set('Page', page)
            .set('PageSize', pageSize);

        if (filters.fullName) params = params.set('FullName', filters.fullName);
        if (filters.jobId) params = params.set('JobId', filters.jobId);
        if (filters.departmentId) params = params.set('DepartmentId', filters.departmentId);
        if (filters.mobileNumber) params = params.set('Mobile', filters.mobileNumber);
        if (filters.email) params = params.set('Email', filters.email);
        if (filters.dobFrom) params = params.set('BirthFrom', filters.dobFrom);
        if (filters.dobTo) params = params.set('BirthTo', filters.dobTo);

        return this.http.get<PaginatedResponse<AddressBook>>(`${this.baseUrl}/search`, { params });
    }

    getById(id: number): Observable<AddressBook> {
        return this.http.get<AddressBook>(`${this.baseUrl}/${id}`);
    }

    add(entry: FormData): Observable<AddressBook> {
        return this.http.post<AddressBook>(this.baseUrl, entry);
    }

    update(entry: AddressBook): Observable<AddressBook> {
        return this.http.put<AddressBook>(`${this.baseUrl}/${entry.id}`, entry);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }


    export(filters: any): Observable<Blob> {
        let params = new HttpParams();
        if (filters.fullName) params = params.set('FullName', filters.fullName);
        if (filters.jobId) params = params.set('JobId', filters.jobId);
        if (filters.departmentId) params = params.set('DepartmentId', filters.departmentId);
        if (filters.mobileNumber) params = params.set('Mobile', filters.mobileNumber);
        if (filters.email) params = params.set('Email', filters.email);
        if (filters.dobFrom) params = params.set('BirthFrom', filters.dobFrom);
        if (filters.dobTo) params = params.set('BirthTo', filters.dobTo);

        return this.http.get(`${this.baseUrl}/export`, {
            params: params,
            responseType: 'blob'
        });
    }
}
