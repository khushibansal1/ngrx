import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SalesforceService } from '../salesforce.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent {
  desc: any = [];
  record: any = [];
  @Input() url!: string|null;
  @Input() isEditOpen?:boolean = true;
  @Output() editStatusChange = new EventEmitter<boolean>();

  constructor(private salesforceService: SalesforceService, private route: ActivatedRoute, private router: Router) {
  
    this.url = localStorage.getItem('url');
    if(!this.url) {
      alert("URL not found!!!");
      router.navigate(['']);
    }else{
      this.fetchRecord(this.url);
    }
  }

  fetchRecord(url: string) {
    this.fetchDescription(url);
 
    this.salesforceService.fetchRecord(url).subscribe({
      next: ((val) => {
        console.log(val);
        this.record = val;
      }),
      error: (err) => console.error(err),
    });
  }

  fetchDescription(url: string) {
    const obj: string | null = this.salesforceService.getObjectNameFromUrl(url);

    if (obj !== null) {
      this.salesforceService.getObjectMetadata(obj).subscribe({
        next: (val) => {
          console.log(val.fields);
          this.desc = val.fields;

        },
        error: (err) => console.error(err),
      });
    }
  }

  submitForm() {
    const payload: any = {};
    for (const field of this.desc) {
      if (field.updateable) {
        payload[field.name] = this.record[field.name];
      }
    }

  
    if(this.url) this.salesforceService.updateRecord(this.url, payload).subscribe({
      next: () => {
        this.isEditOpen = false;
        this.editStatusChange.emit(this.isEditOpen);
      },
      error: (err) => {
        console.error('Error updating record:', err);
      },
    });
  }
}
