import { AdminDashboardService } from './../../services/admin-dashboard.service';
import { User } from './../../interfaces/userInterface';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: '../dashboard.component.css',
})
export class UserComponent implements OnInit {
  users: User[] = [];
  isEditingUser: boolean = false;
  currentUser: User | null = null;
  editUserForm: FormGroup;
  userTypes: { id: string; name: string }[] = []; // Correct userTypes type

  constructor(
    private adminDashboardService: AdminDashboardService,
    private fb: FormBuilder
  ) {
    // Initialize the form with validation
    this.editUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userType: ['', Validators.required], // Single userType selection
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadUserTypes();
  }

  loadUserTypes(): void {
    this.adminDashboardService.getUserTypes().subscribe(
      (userTypes) => {
        this.userTypes = userTypes.map((userType: any) => ({
          id: userType._id, // Store ID of user type
          name: userType.name, // Store name of user type
        }));
      },
      (error) => {
        console.error('Error loading user types:', error);
      }
    );
  }

  loadUsers(): void {
    this.adminDashboardService.getAllUsers().subscribe(
      (users) => {
        this.users = users.map((user: any) => {
          // Check if userType is populated and has a name property
          if (user.userType && user.userType.name) {
            return {
              ...user,
              userType: user.userType.name, // Directly use the name from the populated userType
            };
          }
          return {
            ...user,
            userType: 'Unknown', // If no userType is populated, set as 'Unknown'
          };
        });
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  startEditUser(user: User): void {
    this.isEditingUser = true;
    this.currentUser = user;
    this.editUserForm.setValue({
      username: user.username,
      email: user.email,
      userType: user.userType || '', // Ensure we are using the ID for userType
    });
  }

  getUserTypeName(userTypeId: string): string {
    return userTypeId || 'Unknown'; // Directly return userTypeId (which is a name now) or 'Unknown'
  }

  handleUpdateUser(): void {
    if (this.editUserForm.valid && this.currentUser) {
      const updatedUser: User = {
        ...this.currentUser,
        userType: this.editUserForm.value.userType, // Pass the ObjectId of userType
        ...this.editUserForm.value, // Spread the remaining form data
      };
      this.adminDashboardService.updateUser(this.currentUser._id,updatedUser).subscribe(
        () => {
          this.loadUsers();
          Swal.fire('Success', 'User updated successfully', 'success');
          // console.log('User updated:', updatedUser);
          this.cancelEditUser();
        },
        (error) => {
          console.error('Error updating user:', error);
          Swal.fire('Error', 'Failed to update user', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Please fill all fields correctly', 'error');
    }
  }

  cancelEditUser(): void {
    this.isEditingUser = false;
    this.currentUser = null;
    this.editUserForm.reset();
  }

  toggleUserStatus(user: User): void {
    const updatedStatus = user.userStatus === 'active' ? 'inactive' : 'active';
    const updatedUser = { ...user, userStatus: updatedStatus };
    // console.log('Updated status:', updatedStatus);
    console.log('Updated user:', updatedUser);

    this.adminDashboardService.updateUser(user._id, updatedUser).subscribe(
      () => {
        this.loadUsers();
        Swal.fire('Success', `User ${updatedStatus} successfully`, 'success');
      },
      (error) => {
        console.error('Error updating user status:', error);
        Swal.fire('Error', `Failed to update user status`, 'error');
      }
    );
  }

  deleteUser(userId: string): void {
    this.adminDashboardService.deleteUser(userId).subscribe(
      () => {
        this.loadUsers();
        Swal.fire('Success', 'User Archived successfully', 'success');
      },
      (error) => {
        console.error('Error deleting user:', error);
        Swal.fire('Error', 'Failed to Archived user', 'error');
      }
    );
  }
}
