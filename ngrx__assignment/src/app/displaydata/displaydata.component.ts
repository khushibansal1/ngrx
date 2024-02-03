import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SalesforceService } from '../salesforce.service';
import { fetchObjects, fetchFields, querySalesforce } from '../store/salesforce.actions';
import { selectObjects, selectFields, selectResults, selectError, selectSelectedObject, selectFieldList } from '../store/salesforce.selectors';

@Component({
  selector: 'app-displaydata',
  templateUrl: './displaydata.component.html',
  styleUrl: './displaydata.component.css'
})
export class DisplaydataComponent implements OnInit{
  objlist: string[] = [];
  selectedObject: string = '';
  selectedFields: { [key: string]: boolean } = {};
  fieldList: string[] = [];
  selectedFieldsArray: string[] = [];
  query_res: any = [];

  objects$: Observable<string[]>;
  fields$: Observable<string[]>;
  results$: Observable<any[]>;
  error$: Observable<any>;
  selectedObject$: Observable<string>;
  fieldList$: Observable<string[]>;

  isQueryResVisible: boolean = false;
  isEditOpen: boolean = false;

  constructor(private salesforceService: SalesforceService,  private store: Store) {
    this.isEditOpen = false;

    this.objects$ = this.store.select(selectObjects);
    this.fields$ = this.store.select(selectFields);
    this.results$ = this.store.select(selectResults);
    this.error$ = this.store.select(selectError);
    this.selectedObject$ = this.store.select(selectSelectedObject);
    this.fieldList$ = this.store.select(selectFieldList);
  }

  ngOnInit(): void {
    this.store.dispatch(fetchObjects());
  }

  updateFieldList() {
    this.resetArrays();
    this.resetQueryRes();
    this.store.dispatch(fetchFields({ object: this.selectedObject }));
    console.log(this.fieldList$)
  }

  getFieldList(objectName: string): void {
    this.store.dispatch(fetchFields({ object: this.selectedObject }));
  }

  getSelectedFields(): string[] {
    this.updateSelectedFieldsArray();
    return Object.keys(this.selectedFields).filter(
      (field) => this.selectedFields[field]
    );
  }

  updateSelectedFields(field: string) {
    this.selectedFields[field] = !this.selectedFields[field];
    this.resetQueryRes();
    this.updateSelectedFieldsArray();
  }

  updateSelectedFieldsArray() {
    this.selectedFieldsArray = Object.keys(this.selectedFields).filter(
      (field) => this.selectedFields[field]
    );
  }

  removeSelectedField(field: string) {
    delete this.selectedFields[field];
    this.updateSelectedFieldsArray();

    this.fieldList.forEach((f) => {
      if (f === field) {
        this.selectedFields[f] = false;
      }
    });
  }

  getProperty() {
    this.updateSelectedFieldsArray();
    console.log(this.selectedFieldsArray);
  }

  executeQuery() {
    this.isQueryResVisible = true;
    this.query_res = [];
    this.store.dispatch(querySalesforce({ selectedObject: this.selectedObject, selectedFields: this.selectedFieldsArray }));
  }

  resetArrays() {
    this.selectedFields = {};
    this.selectedFieldsArray = [];
    this.query_res = [];
  }

  resetQueryRes() {
    this.isQueryResVisible = false;
    this.query_res = [];
  }

  onIsEditOpenChange(isEditOpen: boolean) {
    if (!isEditOpen) {
      this.isEditOpen = isEditOpen;
      this.executeQuery();
    }
  }

}
