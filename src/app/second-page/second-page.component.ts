import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  model,
  signal,
} from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DxButtonModule, DxRadioGroupModule } from 'devextreme-angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

export interface EmployeeStatusInput {
  employeeStatusName: string;
  employeeStatusType: 'PKWT' | 'PKWTT';
  duration: number;
  isPKWTCompensation: boolean;
  isProbation: boolean;
}
export interface EmployeeStatusInputEdit {
  id: string;
  employeeStatusName: string;
  employeeStatusType: 'PKWT' | 'PKWTT';
  duration: number;
  isPKWTCompensation: boolean;
  isProbation: boolean;
}

const GET_USERS = gql`
  query {
    employeeStatuses {
      createdAt
      createdBy
      duration
      employeeStatusName
      id
      isPKWTCompensation
      isProbation
      isUsed
      updatedAt
      updatedBy
      employeeStatusType
    }
  }
`;

const REMOVE_USER = gql`
  mutation DeleteEmployeeStatus($id: UUID!) {
    deleteEmployeeStatus(id: $id)
  }
`;

const CREATE_USER = gql`
  mutation ($employeeStatus: [EmployeeStatusInput!]!) {
    createEmployeeStatuses(employeeStatus: $employeeStatus)
  }
`;

const EDIT_USER = gql`
  mutation ($employeeStatus: EmployeeStatusInput!) {
    updateEmployeeStatus(employeeStatus: $employeeStatus)
  }
`;

@Component({
  selector: 'second-page',
  templateUrl: './second-page.component.html',
  styleUrls: ['./second-page.component.css'],
})
export class DataGridComponent implements OnInit {
  dataSource: any[] = [];

  columns = [
    { dataField: 'createdAt', caption: 'Created At' },
    { dataField: 'createdBy', caption: 'Created By' },
    { dataField: 'duration', caption: 'Duration' },
    { dataField: 'employeeStatusName', caption: 'Status Name' },
    { dataField: 'employeeStatusType', caption: 'Status Type' },
    { dataField: 'id', caption: 'ID', allowEditing: false },
    { dataField: 'isPKWTCompensation', caption: 'PKWT Compensation' },
    { dataField: 'isProbation', caption: 'Probation' },
    { dataField: 'isUsed', caption: 'Used' },
    { dataField: 'updatedAt', caption: 'Updated At' },
    { dataField: 'updatedBy', caption: 'Updated By' },
  ];

  constructor(private apollo: Apollo) {
    this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this);
    this.openEditUserModal = this.openEditUserModal.bind(this);
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.apollo
      .watchQuery({
        query: GET_USERS,
      })
      .valueChanges.pipe(map((result: any) => result.data.employeeStatuses))
      .subscribe((users) => {
        console.log(users);
        this.dataSource = users;
      });
  }

  readonly employeeStatuses = signal([]);

  readonly dialog = inject(MatDialog);
  employeeStatusName = signal('');
  employeeStatusType = signal<'PKWT' | 'PKWTT'>('PKWT');
  duration = signal(0);
  isPKWTCompensation = signal(false);
  isProbation = signal(false);

  openAddUserModal(): void {
    const dialogRef = this.dialog.open(AddUserModal, {
      data: {
        employeeStatusName: this.employeeStatusName(),
        employeeStatusType: this.employeeStatusType(),
        duration: this.duration(),
        isPKWTCompensation: this.isPKWTCompensation(),
        isProbation: this.isProbation(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.employeeStatuses.set(result);
      }
    });
  }
  openEditUserModal(e: DxDataGridTypes.ColumnButtonClickEvent): void {
    e.event?.preventDefault();
    e.event?.stopPropagation();

    const userId = e.row?.data.id;

    console.log('User ID:', userId);

    const dialogRef = this.dialog.open(EditUserModal, {
      data: { id: userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.employeeStatuses.set(result);
      }
    });
  }

  onDeleteButtonClick(e: DxDataGridTypes.ColumnButtonClickEvent): void {
    e.event?.preventDefault();
    e.event?.stopPropagation();

    const userId = e.row?.data.id;

    console.log('User ID:', userId);

    this.apollo
      .mutate({
        mutation: REMOVE_USER,
        variables: { id: userId },
      })
      .subscribe({
        next: (result) => {
          console.log('User deleted:', result.data);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          console.error('GraphQLErrors:', error.graphQLErrors);
          console.error('NetworkError:', error.networkError);
          console.error('ErrorMessage:', error.message);
        },
      });
  }
}

/**
 * @title Dialog Add
 */

@Component({
  selector: 'add-user-modal',
  templateUrl: './add-user-modal.html',
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
})
export class AddUserModal {
  constructor(private apollo: Apollo) {
    this.onCreateUser = this.onCreateUser.bind(this);
  }
  readonly dialogRef = inject(MatDialogRef<AddUserModal>);
  readonly data = inject(MAT_DIALOG_DATA);
  employeeStatusName = signal('');
  employeeStatusType = signal<'PKWT' | 'PKWTT'>('PKWT');
  duration = signal(0);
  isPKWTCompensation = signal(false);
  isProbation = signal(false);

  onCreateUser(): void {
    const newStatus: EmployeeStatusInput = {
      employeeStatusName: this.employeeStatusName(),
      employeeStatusType: this.employeeStatusType(),
      duration: this.duration(),
      isPKWTCompensation: this.isPKWTCompensation(),
      isProbation: this.isProbation(),
    };
    console.log(newStatus);
    this.apollo
      .mutate({
        mutation: CREATE_USER,
        variables: { employeeStatus: [newStatus] },
      })
      .subscribe({
        next: (result) => {
          console.log('User created:', result.data);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error creating user:', error);
        },
      });

    this.dialogRef.close(newStatus);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'edit-user-modal',
  templateUrl: './edit-user-modal.html',
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
})
export class EditUserModal {
  readonly dialogRef = inject(MatDialogRef<EditUserModal>);
  readonly data = inject(MAT_DIALOG_DATA);

  id = signal('');
  employeeStatusName = signal('');
  employeeStatusType = signal<'PKWT' | 'PKWTT'>('PKWT');
  duration = signal(0);
  isPKWTCompensation = signal(false);
  isProbation = signal(false);

  constructor(private apollo: Apollo) {
    this.onEditUser = this.onEditUser.bind(this);
  }
  onEditUser(): void {
    const newStatus: EmployeeStatusInputEdit = {
      id: this.data.id,
      employeeStatusName: this.employeeStatusName(),
      employeeStatusType: this.employeeStatusType(),
      duration: this.duration(),
      isPKWTCompensation: this.isPKWTCompensation(),
      isProbation: this.isProbation(),
    };
    console.log(newStatus);
    this.apollo
      .mutate({
        mutation: EDIT_USER,
        variables: { employeeStatus: newStatus },
      })
      .subscribe({
        next: (result) => {
          console.log('User updated:', result.data);
          this.dialogRef.close();
          window.location.reload();
        },
        error: (error) => {
          console.error(
            'Error updating user:',
            error.graphQLErrors,
            error.networkError,
            error.message
          );
        },
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
