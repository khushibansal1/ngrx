import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SalesforceService {
  private apiUrl = 'https://valorx85-dev-ed.develop.my.salesforce.com'; 
  private accessToken='00D5j00000DpkeJ!ASAAQIURNFdlvKrGeLzIJZqI1Ty6FfczbtW58.mR9tt7eEe2saZ7HHmCZ_3GQewGPr8RH0dpOPvBh2ziFfo4FsmekJcRXOfD'; 
  constructor(private http: HttpClient) {}
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  }
   fetchObjects(): Observable<string[]> {

    return this.http.get(`${this.apiUrl}/services/data/v58.0/sobjects`, { headers: this.getHeaders() }).pipe(
      map((res) => {
        if (res && (res as any)['sobjects']) {
          return (res as any)['sobjects'].map((sobject: any) => sobject.name);
        } else {
          console.error(
            'Invalid response format. Missing "sobjects" property.'
          );
          return []; 
        }
      })
    );
  }
  fetchFields(object: string): Observable<string[]> {
    const url = `${this.apiUrl}/services/data/v58.0/sobjects/` + object + '/describe';
    return this.http.get(url, { headers: this.getHeaders() }).pipe(
      map((res: any) => {
        if (res && res.fields) {
          const fieldNames = res.fields.map((field: any) => field.name);
          return fieldNames;
        } else {
          console.error('Invalid response format. Missing "fields" property.');
          return []; 
        }
      })
    );
  }

  querySalesforce(
    selectedObject: string|null,
    selectedFields: string[]
  ): Observable<any> {
    const fieldList = selectedFields.join(',');
    const query = `SELECT+${fieldList}+FROM+${selectedObject}`;
    const url = `${this.apiUrl}/services/data/v58.0/query/?q=${query}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getObjectMetadata(objectName: string|null): Observable<any> {
    const url = `${this.apiUrl}/services/data/v58.0/sobjects/${objectName}/describe`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }

  deleteRecord(recordUrl: string): Observable<any> {
    const url: string = `${this.apiUrl}${recordUrl}`;
    return this.http.delete<any>(url, { headers: this.getHeaders() });
  }

  fetchRecord(recordUrl: string): Observable<any> {
    const url: string = `${this.apiUrl}${recordUrl}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }

  getObjectNameFromUrl(url: string): string | null {
    const parts = url.split('/');

    const sobjectsIndex = parts.indexOf('sobjects');

    if (sobjectsIndex !== -1 && sobjectsIndex < parts.length - 1) {
      return parts[sobjectsIndex + 1];
    }

    return null;
  }

  updateRecord(url: string, obj: any) {
    const updateUrl = `${this.apiUrl}/${url}`;
    return this.http.patch(updateUrl, obj, { headers: this.getHeaders() });
  }
}
