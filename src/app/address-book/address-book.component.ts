import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddressBookService } from '../Services/address-book.service';
import { JobService } from '../Services/job.service';
import { DepartmentService } from '../Services/department.service';
import { AddressBook } from '../Models/address-book';
import { Department } from '../Models/department';
import { Job } from '../Models/job';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../enviroments/enviroment';

declare var bootstrap: any;

@Component({
  selector: 'app-address-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-book.component.html',
  styleUrl: './address-book.component.css'
})
export class AddressBookComponent implements OnInit {
  entries: AddressBook[] = [];
  jobs: Job[] = [];
  departments: Department[] = [];
  loading = false;
  isSaving = false;
  deleteId: number | null = null;
  searchCollapsed = true;


  totalCount = 0;
  page = 1;
  pageSize = 10;
  totalPages = 0;

  searchForm: FormGroup;
  entryForm: FormGroup;
  isEditMode = false;
  currentEntryId: number | null = null;

  private entryModalInstance: any;
  private confirmModalInstance: any;
  private viewModalInstance: any;
  viewEntry: AddressBook | null = null;

  constructor(
    private addressBookService: AddressBookService,
    private jobService: JobService,
    private deptService: DepartmentService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.searchForm = this.fb.group({
      fullName: [''],
      jobId: [''],
      departmentId: [''],
      email: [''],
      mobileNumber: [''],
      dobFrom: [''],
      dobTo: ['']
    });

    this.entryForm = this.fb.group({
      fullName: ['', Validators.required],
      jobId: [null, Validators.required],
      departmentId: [null, Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9+ -]+$')]],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.initModals();
    this.loadJobsAndDepts();
    this.loadData();
  }

  initModals() {
    const entryElement = document.getElementById('entryModal');
    if (entryElement) {
      this.entryModalInstance = new bootstrap.Modal(entryElement);
    }
    const confirmElement = document.getElementById('confirmModal');
    if (confirmElement) {
      this.confirmModalInstance = new bootstrap.Modal(confirmElement);
    }

    const viewElement = document.getElementById('viewModal');
    if (viewElement) {
      this.viewModalInstance = new bootstrap.Modal(viewElement);
    }
  }

  loadJobsAndDepts() {

    this.jobService.list().subscribe({
      next: j => this.jobs = j,
      error: () => this.toastr.error('Could not load Jobs')
    });
    this.deptService.list().subscribe({
      next: d => this.departments = d,
      error: () => this.toastr.error('Could not load Departments')
    });
  }

  loadData() {
    this.loading = true;
    const filters = this.searchForm.value;

    this.addressBookService.search(filters, this.page, this.pageSize).subscribe({
      next: res => {
        this.entries = res.items;
        console.log('Entries loaded:', this.entries);
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.toastr.error('Failed to load data');
      }
    });
  }

  onPageChange(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadData();
    }
  }

  search() {
    this.page = 1;
    this.loadData();
  }

  reset() {
    this.searchForm.reset({
      fullName: '',
      email: '',
      mobileNumber: '',
      jobId: '',
      departmentId: '',
      dobFrom: '',
      dobTo: ''
    });
    this.page = 1;
    this.loadData();
  }

  openAdd() {
    this.isEditMode = false;
    this.currentEntryId = null;
    this.entryForm.reset();
    this.selectedFile = null;
    this.imagePreview = null;


    if (this.jobs.length > 0) {
      this.entryForm.patchValue({ jobId: this.jobs[0].id });
    }
    if (this.departments.length > 0) {
      this.entryForm.patchValue({ departmentId: this.departments[0].id });
    }

    this.entryModalInstance.show();
  }

  openEdit(entry: AddressBook) {
    this.isEditMode = true;
    this.currentEntryId = entry.id;


    let dob = '';
    if (entry.dateOfBirth) {
      dob = entry.dateOfBirth.split('T')[0];
    }

    this.entryForm.patchValue({
      fullName: entry.fullName,
      jobId: entry.jobId,
      departmentId: entry.departmentId,
      mobileNumber: entry.mobileNumber,
      dateOfBirth: dob,
      address: entry.address,
      email: entry.email
    });
    this.entryModalInstance.show();
  }

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveEntry() {
    if (this.entryForm.invalid) {
      this.entryForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields correctly.');
      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.currentEntryId) {
      const model: AddressBook = {
        ...this.entryForm.value,
        id: this.currentEntryId
      };

      this.addressBookService.update(model).subscribe({
        next: () => {
          this.toastr.success('Entry updated successfully');
          this.entryModalInstance.hide();
          this.loadData();
          this.isSaving = false;
        },
        error: err => {
          this.toastr.error('Update failed: ' + (err.error?.message || err.message));
          this.isSaving = false;
        }
      });
    } else {
      const formData = new FormData();
      Object.keys(this.entryForm.controls).forEach(key => {
        const value = this.entryForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          formData.append(this.capitalizeFirstLetter(key), value);
        }
      });

      if (this.selectedFile) {
        formData.append('Photo', this.selectedFile);
      }

      this.addressBookService.add(formData).subscribe({
        next: () => {
          this.toastr.success('Entry added successfully');
          this.entryModalInstance.hide();
          this.loadData();
          this.isSaving = false;
        },
        error: err => {
          this.toastr.error('Add failed: ' + (err.error?.message || err.message));
          this.isSaving = false;
        }
      });
    }
  }

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  confirmDelete(entry: AddressBook) {
    this.deleteId = entry.id;
    this.confirmModalInstance.show();
  }

  doDelete() {
    if (this.deleteId) {
      this.addressBookService.delete(this.deleteId).subscribe({
        next: () => {
          this.toastr.success('Entry deleted');
          this.confirmModalInstance.hide();
          this.deleteId = null;
          this.loadData();
        },
        error: err => this.toastr.error('Delete failed')
      });
    }
  }

  openView(entry: AddressBook) {
    this.viewEntry = entry;
    this.viewModalInstance.show();
  }

  exportExcel() {
    this.addressBookService.export(this.searchForm.value).subscribe(blob => {
      saveAs(blob, 'address_book.xlsx');
    });
  }

  getPhotoUrl(entry: AddressBook): string | null {
    const filename = entry.photoFileName || entry.photo;
    if (filename) {
      if (filename.startsWith('http')) {
        return filename;
      }
      const photosBaseUrl = environment.apiLocalBaseUrl.replace('/api', '/photos');
      return `${photosBaseUrl}/${filename}`;
    }
    return null;
  }
}
