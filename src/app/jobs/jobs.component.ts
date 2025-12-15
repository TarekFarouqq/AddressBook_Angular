import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JobService } from '../core/services/job.service';
import { Job } from '../core/models/job';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
    selector: 'app-jobs',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './jobs.component.html'
})
export class JobsComponent implements OnInit {
    jobs: Job[] = [];
    form: FormGroup;
    isSaving = false;
    isEditMode = false;
    currentId: number | null = null;
    deleteId: number | null = null;

    modal: any;
    deleteModal: any;

    constructor(
        private jobService: JobService,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {
        this.form = this.fb.group({
            title: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.initModals();
        this.loadData();
    }

    initModals() {
        const modalEl = document.getElementById('jobModal');
        if (modalEl) this.modal = new bootstrap.Modal(modalEl);

        const delEl = document.getElementById('deleteJobModal');
        if (delEl) this.deleteModal = new bootstrap.Modal(delEl);
    }

    loadData() {
        this.jobService.list().subscribe(res => this.jobs = res);
    }

    openAdd() {
        this.isEditMode = false;
        this.form.reset();
        this.modal.show();
    }

    openEdit(job: Job) {
        this.isEditMode = true;
        this.currentId = job.id;
        this.form.patchValue({ title: job.name });
        this.modal.show();
    }

    save() {
        if (this.form.invalid) return;

        this.isSaving = true;
        const title = this.form.value.title;

        if (this.isEditMode && this.currentId) {
            this.jobService.update(this.currentId, title).subscribe({
                next: () => {
                    this.toastr.success('Job updated');
                    this.modal.hide();
                    this.loadData();
                    this.isSaving = false;
                },
                error: (err) => {
                    this.isSaving = false;
                }
            });
        } else {
            this.jobService.add(title).subscribe({
                next: () => {
                    this.toastr.success('Job added');
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

    confirmDelete(job: Job) {
        this.deleteId = job.id;
        this.deleteModal.show();
    }

    doDelete() {
        if (this.deleteId) {
            this.jobService.delete(this.deleteId).subscribe({
                next: () => {
                    this.toastr.success('Job deleted');
                    this.deleteModal.hide();
                    this.loadData();
                },
                error: (err) => {
                    if (err.status === 409) {
                        this.toastr.error(err.error.message);
                    } else {
                        this.toastr.error('Failed to delete job');
                    }
                    this.deleteModal.hide();
                }
            });
        }
    }
}
