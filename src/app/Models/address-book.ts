export interface AddressBook {
    id: number;
    fullName: string;
    jobId: number;
    jobName?: string;
    departmentId: number;
    departmentName?: string;
    mobileNumber: string;
    dateOfBirth: string;
    address: string;
    email: string;
    photoFileName?: string | null;
    photo?: string | null;
    imgError?: boolean;
    age?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
