import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { Product } from '../../interfaces/productInterface';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { Category } from '../../interfaces/categoryInterface';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: '../dashboard.component.css',
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isAddingProduct: boolean = false;
  isEditingProduct: boolean = false;
  currentProduct: Product | null = null;
  newProduct: Product = this.initializeNewProduct();
  addProductForm: FormGroup;
  editProductForm: FormGroup;
  imageURL: string = '';
  categories: Category[] = [];
  filterForm: FormGroup;
  allProducts: Product[] = [];
  filteredProducts = [...this.allProducts];
  constructor(
    private adminDashboardService: AdminDashboardService,
    private fb: FormBuilder
  ) {
    this.imageURL = adminDashboardService.apiUrl + '/images/';
    this.addProductForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      subCategory: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      bestSellers: new FormControl(false),
      rank: new FormControl(0),
      carousel: new FormControl(false),
      productImage: new FormControl('', [Validators.required]),
      status: this.fb.group({
        availability: new FormControl('', [Validators.required]),
        stockStatus: new FormControl('', [Validators.required]),
      }),
    });

    this.editProductForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      subCategory: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      bestSellers: new FormControl(''),
      rank: new FormControl(''),
      carousel: new FormControl(''),
      status: new FormGroup({
        availability: new FormControl(''),
        stockStatus: new FormControl(''),
      }),
      productImage: new FormControl(''),
    });

    this.filterForm = this.fb.group({
      name: [''],
      category: [''],
      priceRange: [''],
      availability: [''],
      stockStatus: [''],
    });
  }

  applyFilter(): void {
    const filters = this.filterForm.value;
    console.log('Filter values:', filters);

    const [minPrice, maxPrice] = filters.priceRange
      ? filters.priceRange.split('-').map(Number)
      : [null, null];

    this.filteredProducts = this.allProducts.filter((product: Product) => {
      const matchesName = filters.name
        ? product.name.toLowerCase().includes(filters.name.toLowerCase())
        : true;
      const matchesCategory = filters.category
        ? product.category === filters.category
        : true;
      const matchesPrice =
        minPrice !== null && maxPrice !== null
          ? product.price >= minPrice && product.price <= maxPrice
          : true;
      const matchesAvailability = filters.availability
        ? product.status?.availability === filters.availability
        : true;
      const matchesStockStatus = filters.stockStatus
        ? product.status?.stockStatus === filters.stockStatus
        : true;

      return (
        matchesName &&
        matchesCategory &&
        matchesPrice &&
        matchesAvailability &&
        matchesStockStatus
      );
    });

    console.log('Filtered Products:', this.filteredProducts);
  }

  resetFilter(): void {
    this.filterForm.reset();
    this.filteredProducts = [...this.allProducts];
    // this.allProducts = [...this.filteredProducts];
  }

  // Start editing product
  startEditProduct(product: Product): void {
    this.isEditingProduct = true;
    this.currentProduct = product;
    this.editProductForm.patchValue({
      name: product.name,
      price: product.price,
      category: product.category,
      subCategory: product.subCategory,
      description: product.description,
      bestSellers: product.bestSellers,
      rank: product.rank,
      carousel: product.carousel,
      status: {
        availability: product.status.availability,
        stockStatus: product.status.stockStatus,
      },
      productImage: product.productImage, // Ensure this is included
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.filteredProducts = [...this.products];
    this.loadCategories();
  }

  loadCategories(): void {
    this.adminDashboardService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => console.error('Error loading categories:', error)
    );
  }

  deleteProduct(id: string): void {
    this.adminDashboardService.deleteProduct(id).subscribe(
      () => {
        // console.log('Product deleted');
        this.loadProducts();
        Swal.fire('Success', 'Product deleted successfully', 'success');
      },
      (error) => {
        console.error('Error deleting product:', error);
        Swal.fire('Error', 'Failed to delete product', 'error');
      }
    );
  }
  // Cancel editing product
  cancelEditProduct(): void {
    this.isEditingProduct = false;
    this.currentProduct = null;
  }

  loadProducts(): void {
    this.adminDashboardService.getAllProducts().subscribe(
      (products) => {
        this.products = products;
        this.allProducts = [...products];
        this.filteredProducts = [...products];
      },
      (error) => {
        console.error('Error fetching products:', error);
        Swal.fire(
          'Error',
          'Failed to load products. Please try again later.',
          'error'
        );
      }
    );
  }

  initializeNewProduct(): Product {
    return {
      _id: '',
      name: '',
      price: 0,
      category: '',
      subCategory: '',
      description: '',
      productImage: '',
      bestSellers: false,
      carousel: false,
      rank: 0,
      status: { availability: 'available', stockStatus: 'inStock' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  toggleAddProductForm(): void {
    this.isAddingProduct = !this.isAddingProduct;
    this.resetForm();
  }

  toggleEditProductForm(product: Product): void {
    this.isEditingProduct = true;
    this.currentProduct = product;
    this.addProductForm.patchValue(product);
  }

  handleAddProduct(): void {
    if (this.addProductForm.valid) {
      // console.log('Form data:', this.addProductForm.value); // Debugging step

      const formData = new FormData();

      // Append top-level form controls
      formData.append('name', this.addProductForm.get('name')?.value || '');
      formData.append('price', this.addProductForm.get('price')?.value || '');
      formData.append(
        'category',
        this.addProductForm.get('category')?.value || ''
      );
      formData.append(
        'subCategory',
        this.addProductForm.get('subCategory')?.value || ''
      );
      formData.append(
        'bestSellers',
        this.addProductForm.get('bestSellers')?.value || 'false'
      );
      formData.append('rank', this.addProductForm.get('rank')?.value || '');
      formData.append(
        'carousel',
        this.addProductForm.get('carousel')?.value || 'false'
      );
      formData.append(
        'description',
        this.addProductForm.get('description')?.value || ''
      );

      // Handle nested form controls in 'status'
      const statusGroup = this.addProductForm.get('status');
      if (statusGroup) {
        formData.append(
          'availability',
          statusGroup.get('availability')?.value || ''
        );
        formData.append(
          'stockStatus',
          statusGroup.get('stockStatus')?.value || ''
        );
      }

      // Handle file input for 'productImage'
      const productImage = this.addProductForm.get('productImage')?.value;
      if (productImage) {
        formData.append('productImage', productImage);
      }

      // Call service to add product
      this.adminDashboardService.addProduct(formData).subscribe(
        (newProduct) => {
          // console.log('Product added:', newProduct);
          this.loadProducts(); // Refresh the product list
          this.isAddingProduct = false; // Reset the adding state
          this.newProduct = this.initializeNewProduct(); // Reset the form
          Swal.fire('Success', 'Product added successfully', 'success');
        },
        (error) => {
          console.error('Error adding product:', error);
          Swal.fire('Error', 'Failed to add product', 'error');
        }
      );
    } else {
      // Form is invalid; provide user feedback
      Swal.fire('Error', 'Please complete the form before submitting', 'error');
      // console.log('form: ', this.addProductForm.value);
      this.addProductForm.markAllAsTouched(); // Highlight all invalid fields
    }
  }

  handleEditProduct(): void {
    if (this.editProductForm.valid && this.currentProduct) {
      const updatedProduct = {
        ...this.currentProduct,
        ...this.editProductForm.value,
      };

      this.adminDashboardService
        .updateProduct(this.currentProduct._id, updatedProduct)
        .subscribe(
          () => {
            this.loadProducts();
            this.isEditingProduct = false;
            Swal.fire('Success', 'Product updated successfully', 'success');
          },
          (error) => {
            console.error('Error updating product:', error);
            Swal.fire(
              'Error',
              'Failed to update product. Please try again.',
              'error'
            );
          }
        );
    }
  }

  handleDeleteProduct(productId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminDashboardService.deleteProduct(productId).subscribe(
          () => {
            this.products = this.products.filter(
              (product) => product._id !== productId
            );
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting product:', error);
            Swal.fire(
              'Error',
              'Failed to delete product. Please try again.',
              'error'
            );
          }
        );
      }
    });
  }

  cancelAddProduct(): void {
    this.isAddingProduct = false;
    this.newProduct = this.initializeNewProduct();
  }

  // Handle product update
  handleUpdateProduct(): void {
    if (this.editProductForm.valid) {
      this.adminDashboardService
        .updateProduct(this.currentProduct!._id, this.editProductForm.value)
        .subscribe((response) => {
          console.log('Product updated', response);
          this.isEditingProduct = false;
          this.loadProducts(); // Reload products list
          Swal.fire('Success', 'Product updated successfully', 'success');
        });
      Swal.fire('Error', 'Failed to update product', 'error');
    }
  }

  updateProduct(product: Product): void {
    this.adminDashboardService.updateProduct(product._id, product).subscribe(
      (updatedProduct) => {
        console.log('Product updated:', updatedProduct);
        // set the new data
        this.loadProducts();
        Swal.fire('Success', 'Product updated successfully', 'success');
      },
      (error) => {
        console.error('Error updating product:', error);
        Swal.fire('Error', 'Failed to update product', 'error');
      }
    );
  }

  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.addProductForm.patchValue({
        productImage: file,
      });
      // Swal.fire('Success', 'Image uploaded successfully', 'success');
    } else {
      Swal.fire('Error', 'Failed to upload image', 'error');
    }
  }

  handleUpdateImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.editProductForm.patchValue({
        productImage: file,
      });
    }
  }

  resetForm(): void {
    this.addProductForm.reset();
    this.currentProduct = null;
  }
}
