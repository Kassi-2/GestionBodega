import { SearchService } from './../../../core/services/search.service';
import { contains, Lending, lendingProducts, newLending } from './../../../core/models/lending.interface';
import { ProductService } from './../../../core/services/product.service';
import { LendingService } from './../../../core/services/lending.service';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  UserStudent,
  UserAssitant,
  UserTeacher,
  User,
} from '../../../core/models/user.interface';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Degree } from '../../../core/models/degree.interface';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../core/models/product.interface';
import { UserService } from '../../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lending-add',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterModule,
    NgbPagination,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './lending-add.component.html',
  styleUrls: ['./lending-add.component.css'],
})
export class LendingAddComponent implements OnInit {
  currentStep: number = 1;
  public pageTeachers = 1;
  public pageAssistants = 1;
  public pageStudents = 1;
  public pageProducts = 1
  public pageSize = 15;
  selectedUserType: string = 'student';
  selectedUser: User | null = null;
  user!: User;
  students!: UserStudent[];
  degrees!: Degree[];
  filteredStudents: UserStudent[] = [];
  filteredTeachers: UserTeacher[] = [];
  filteredAssistants: UserAssitant[] = [];
  teachers!: UserTeacher[];
  assistants!: UserAssitant[];
  searchTermUsers: string = '';
  searchTermProducts: string = '';
  products: Product[] = [];
  contains: contains[] = [];
  selectedTeacher: User | null = null;
  comments: string = '';
  lending!: newLending;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private LendingService: LendingService,
    private productService: ProductService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.LendingService.getCurrentStep().subscribe((step: number) => {
      this.currentStep = step;
    });

    this.LendingService.getSelectedUser().subscribe(
      (savedUser: User | null) => {
        if (!this.selectedUser && savedUser) {
          this.selectedUser = savedUser;
        } else if (!savedUser) {
          this.selectedUser = null;
        }
      }
    );

    // this.LendingService.getLending().subscribe(
    //   (contains: lendingProducts[] | null) => {
    //     if (contains) {
    //       this.contains = contains;
    //     } else {
    //       this.contains = [];
    //     }
    //   }
    // );

    this.subscriptions.add(this.getAllStudents());
    this.subscriptions.add(this.getAllTeachers());
    this.subscriptions.add(this.getAllAssistants());
    this.subscriptions.add(this.getAllDegrees());
    this.subscriptions.add(this.getProducts());
  }

  filteredList(): Product[] {
    const filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(this.searchTermProducts.toLowerCase()) ||
        product.id.toString().includes(this.searchTermProducts.toLowerCase())
    );
    return filteredProducts;
  }

  getQuantity(productId: number): number {
    const item = this.contains.find((c) => c.productId === productId);
    return item ? item.amount : 0;
  }

  incrementQuantity(productId: number, stock: number) {
    let productContains = this.contains.find((q) => q.productId === productId);

    if (productContains) {
      if (productContains.amount < stock + productContains.amount) {
        productContains.amount += 1;
        this.updateVisualStock(productId, -1);
      }
    } else {
      if (stock > 0) {
        this.contains.push({
          productId: productId,
          amount: 1,
        });
        this.updateVisualStock(productId, -1);
      }
    }

    // this.LendingService.setContains(this.contains);
  }

  decrementQuantity(productId: number) {
    let productContains = this.contains.find((q) => q.productId === productId);

    if (productContains && productContains.amount > 0) {
      productContains.amount -= 1;
      this.updateVisualStock(productId, 1);
    }

    if (productContains?.amount === 0) {
      this.contains = this.contains.filter((q) => q.productId !== productId);
    }

    // this.LendingService.setContains(this.contains);
  }

  updateVisualStock(productId: number, change: number) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      product.stock += change;
    }
  }

  decreaseStock(productId: number) {
    const product = this.products.find((p) => p.id === productId);
    if (product && product.stock > 0) {
      product.stock -= 1;
    }
  }

  hasSelectedProduct(): boolean {
    return this.contains.some((item) => item.amount >= 0);
  }

  getProducts(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.LendingService.setSelectedUser(user);
  }

  selectTeacher(teacher: UserTeacher) {
    this.selectedTeacher = teacher;
  }

  selectUserType(type: string) {
    this.selectedUserType = type;
  }

  onQuantityInput(event: Event, productId: number, stock: number): void {
    const input = event.target as HTMLInputElement;
    let newQuantity = input.valueAsNumber;

    if (isNaN(newQuantity)) {
      newQuantity = 0;
    } else if (newQuantity < 0) {
      newQuantity = 0;
    } else if (newQuantity > stock) {
      Swal.fire({
        title: 'Error',
        text: 'La cantidad ingresada excede el stock disponible.',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false
      });
      newQuantity = stock;
      input.value = stock.toString();
    }

    const productContains = this.contains.find(q => q.productId === productId);

    if (productContains) {
      const previousQuantity = productContains.amount;
      const quantityChange = newQuantity - previousQuantity;

      if (newQuantity <= stock) {
        productContains.amount = newQuantity;

        const product = this.products.find((p) => p.id === productId);
        if (product) {
          product.stock -= quantityChange;
        }
      }
    } else {
      if (newQuantity <= stock) {
        this.contains.push({ productId, amount: newQuantity });

        const product = this.products.find((p) => p.id === productId);
        if (product) {
          product.stock -= newQuantity;
        }
      }
    }

    // this.LendingService.setContains(this.contains);
  }

  getDegree(code: string) {
    if (!this.degrees) {
      return 'Desconocido';
    }
    const degree = this.degrees.find((d) => d.code === code);
    return degree?.name || 'Desconocido';
  }

  private getAllStudents() {
    this.userService.getAllStudents().subscribe((students: UserStudent[]) => {
      this.students = students;
      this.filteredStudents = students;
    });
  }

  private getAllTeachers() {
    this.userService.getAllTeachers().subscribe((teachers: UserTeacher[]) => {
      this.teachers = teachers;
      this.filteredTeachers = teachers;
    });
  }

  private getAllAssistants() {
    this.userService
      .getAllAssistants()
      .subscribe((assistants: UserAssitant[]) => {
        this.assistants = assistants;
        this.filteredAssistants = assistants;
      });
  }

  private getAllDegrees() {
    this.userService.getAllDegrees().subscribe((degrees: Degree[]) => {
      this.degrees = degrees;
    });
  }

  stepUp() {
    this.currentStep++;
    this.searchTermProducts = ''
    this.searchTermUsers = ''
    this.LendingService.setCurrentStep(this.currentStep);
  }

  stepDown() {
    this.currentStep--;
    this.LendingService.setCurrentStep(this.currentStep);
  }

  endAddLending() {
    if (!this.selectedUser) {
      console.error('No user selected.');
      return;
    }

    this.currentStep = 1;

    this.lending = {
      comments: this.comments,
      borrowerId: this.selectedUser?.id,
      teacherId: this.selectedTeacher?.id,
      lendingProducts: this.contains,
    };

    console.log(this.lending)

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger me-2',
      },
      buttonsStyling: false,
    });

    this.LendingService.addLending(this.lending).subscribe({
      next: () => {
        swalWithBootstrapButtons.fire({
          title: '¡Préstamo creado!',
          text: 'El préstamo ha sido creado con éxito.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,

      })

      this.initializeLendingForm();

    },
    error: (error) => {
      swalWithBootstrapButtons.fire({
        title: 'Error',
        text: 'El préstamo no se ha guardado, revise nuevamente la información ingresada o solicite ayuda.',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      })

    },

    });
  }

  onSearch() {
    const searchTermLower = this.searchTermUsers.toLowerCase();

    if (this.selectedUserType === 'student') {
      this.filteredStudents = this.students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTermLower) ||
          student.rut.toLowerCase().includes(searchTermLower)
      );
    }

    if (this.selectedUserType === 'teacher') {
      this.filteredTeachers = this.teachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTermLower) ||
          teacher.rut.toLowerCase().includes(searchTermLower)
      );
    }

    if (this.selectedUserType === 'assistant') {
      this.filteredAssistants = this.assistants.filter(
        (assistant) =>
          assistant.name.toLowerCase().includes(searchTermLower) ||
          assistant.rut.toLowerCase().includes(searchTermLower)
      );
    }

    this.pageAssistants = 1;
    this.pageStudents = 1;
    this.pageTeachers = 1;
  }


  getProductById(productId: number): Product | undefined {
    return this.products.find(product => product.id === productId);
  }




  initializeLendingForm() {
    this.currentStep = 1;
    this.comments = '';
    this.selectedUser = null;
    this.selectedTeacher = null;
    this.contains = [];
    // this.LendingService.setContains(null);
    this.LendingService.setSelectedUser(null);
  }

  cancel() {
    this.initializeLendingForm();
    this.LendingService.setCurrentStep(1);
  }
}
