import { AdminDashboardService } from './../../services/admin-dashboard.service';
import { User } from './../../interfaces/userInterface';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
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
        this.users = users.map((user: any) => ({
          ...user,
          userType: user.userType.name, // Assuming the populated userType has a 'name' field
        }));
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  /*   loadUsers(): void {
    this.adminDashboardService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  } */

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
    const userType = this.userTypes.find((type) => type.id === userTypeId);
    console.log('userType:', userType);
    console.log('userTypes:', this.userTypes);
    console.log('userTypeId:', userTypeId);
    return userType?.name || 'Unknown'; // Return the name of the user type or 'Unknown' if undefined
    // return userType ? userType.name : 'Unknown'; // Return the name of the user type
  }

  handleUpdateUser(): void {
    if (this.editUserForm.valid && this.currentUser) {
      const updatedUser: User = {
        ...this.currentUser,
        userType: this.editUserForm.value.userType, // Pass the ObjectId of userType
        ...this.editUserForm.value, // Spread the remaining form data
      };
      console.log('updatedUser:', updatedUser);
      console.log('editUserForm:', this.editUserForm.value);
      this.adminDashboardService.updateUser(updatedUser).subscribe(
        (updatedUser) => {
          console.log('User updated:', updatedUser);
          this.loadUsers();
          Swal.fire('Success', 'User updated successfully', 'success');
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

  deleteUser(id: string): void {
    this.adminDashboardService.deleteUser(id).subscribe(
      () => {
        console.log('User deleted');
        this.loadUsers();
        Swal.fire('Success', 'User deleted successfully', 'success');
      },
      (error) => {
        console.error('Error deleting user:', error);
        Swal.fire('Error', 'Failed to delete user', 'error');
      }
    );
  }
}
