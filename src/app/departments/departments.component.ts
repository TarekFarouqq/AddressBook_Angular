import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../Services/department.service';
import { Department } from '../Models/department';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
    selector: 'app-departments',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './departments.component.html'
})
export class DepartmentsComponent implements OnInit {
    departments: Department[] = [];
    form: FormGroup;
    isSaving = false;
    isEditMode = false;
    currentId: number | null = null;
    deleteId: number | null = null;

    modal: any;
    deleteModal: any;

    constructor(
        private deptService: DepartmentService,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.initModals();
        this.loadData();
    }

    initModals() {
        const modalEl = document.getElementById('deptModal');
        if (modalEl) this.modal = new bootstrap.Modal(modalEl);

        const delEl = document.getElementById('deleteDeptModal');
        if (delEl) this.deleteModal = new bootstrap.Modal(delEl);
    }

    loadData() {
        this.deptService.list().subscribe(res => this.departments = res);
    }

    openAdd() {
        this.isEditMode = false;
        this.form.reset();
        this.modal.show();
    }

    openEdit(dept: Department) {
        this.isEditMode = true;
        this.currentId = dept.id;
        this.form.patchValue({ name: dept.name });
        this.modal.show();
    }

    save() {
        if (this.form.invalid) return;

        this.isSaving = true;
        const name = this.form.value.name;

        if (this.isEditMode && this.currentId) {
            this.deptService.update(this.currentId, name).subscribe({
                next: () => {
                    this.toastr.success('Department updated');
                    this.modal.hide();
                    this.loadData();
                    this.isSaving = false;
                },
                error: (err) => {
                    this.isSaving = false;
                }
            });
        } else {
            this.deptService.add(name).subscribe({
                next: () => {
                    this.toastr.success('Department added');
                    this.modal.hide();
                    this.loadData();
                    this.isSaving = false;
                },
                error: (err) => {
                    this.isSaving = false;
                }
            });
        }
    }

    confirmDelete(dept: Department) {
        this.deleteId = dept.id;
        this.deleteModal.show();
    }

    doDelete() {
        if (this.deleteId) {
            this.deptService.delete(this.deleteId).subscribe({
                next: () => {
                    this.toastr.success('Department deleted');
                    this.deleteModal.hide();
                    this.loadData();
                },
                error: (err) => {
                    if (err.status === 409) {
                        this.toastr.error(err.error.message);
                    } else {
                        this.toastr.error('Failed to delete department');
                    }
                    this.deleteModal.hide();
                }
            });
        }
    }
}
