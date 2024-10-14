import { SearchService } from './../../../core/services/search.service';
import { Lending } from './../../../core/models/lending.interface';
import { ProductService } from './../../../core/services/product.service';
import { LendingService } from './../../../core/services/lending.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { UserStudent, UserAssitant, UserTeacher, User } from '../../../core/models/user.interface';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Degree } from '../../../core/models/degree.interface';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../core/models/product.interface';
import { Contains } from '../../../core/models/lending.interface';
import { UserService } from '../../../core/services/user.service';



@Component({
  selector: 'app-lending-add',
  standalone: true,
  imports: [HttpClientModule, RouterModule, NgbPagination, CommonModule, FormsModule],
  templateUrl: './lending-add.component.html',
  styleUrls: ['./lending-add.component.css']
})
export class LendingAddComponent implements OnInit{

  currentStep: number = 1;
  public page = 1;
  public pageSize = 15;
  public selectedUserType: string = "student";
  public selectedUser: User | null = null;
  public user!: User;
  public students!: UserStudent[];
  public degrees!: Degree[];
  public filteredStudents: UserStudent[] = [];
  public filteredTeachers: UserTeacher[] = [];
  public filteredAssistants: UserAssitant[] = [];
  public teachers! : UserTeacher[];
  public assistants! : UserAssitant[];
  searchTerm: string = '';
  products: Product[] = [];
  public contains: Contains[] = [];
  public selectedTeacher: User | null = null;
  selectedTeacherId!: number;
  public comments: string = '';
  lending!: Lending;

  private subscriptions: Subscription = new Subscription();


  constructor(private LendingService : LendingService, private productService: ProductService, private userService: UserService, private searchService: SearchService) { }

  ngOnInit(): void  {
    this.LendingService.getCurrentStep().subscribe((step: number) => {
      this.currentStep = step;
    });

    this.LendingService.getSelectedUser().subscribe((savedUser: User | null) => {
      if (!this.selectedUser && savedUser) {
        this.selectedUser = savedUser;
        console.log('Usuario recuperado:', this.selectedUser);
      } else if (!savedUser) {
        this.selectedUser = null;
        console.log('No se encontró un usuario guardado.');
      }
    });



    this.LendingService.getLending().subscribe((contains: Contains[] | null) => {
      if (contains) {
        this.contains = contains;
        console.log('Contains recuperado:', this.contains);
      } else {
        this.contains = [];
        console.log('No se encontraron productos guardados.');
      }
    });

    this.subscriptions.add(this.getAllStudents());
    this.subscriptions.add(this.getAllTeachers());
    this.subscriptions.add(this.getAllAssistants());
    this.subscriptions.add(this.getAllDegrees());
    this.subscriptions.add(this.getProducts());
  }


  filteredList(): Product[] {
    const filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.id.toString().includes(this.searchTerm.toLowerCase())
    );
    return filteredProducts;
  }

  getQuantity(productId: number): number {
    const item = this.contains.find(c => c.productId === productId);
    return item ? item.amount : 0;
}

incrementQuantity(productId: number, stock: number) {
  let productContains = this.contains.find(q => q.productId === productId);

  // Si ya existe en el carrito y la cantidad seleccionada es menor que el stock disponible
  if (productContains) {
    if (productContains.amount < stock+productContains.amount) {
      productContains.amount += 1;
      this.updateVisualStock(productId, -1); // Reducir el stock visual
    }
  } else {
    // Si no está en el carrito y hay stock disponible
    if (stock > 0) {
      this.contains.push({ lendingId: null, productId: productId, amount: 1 });
      this.updateVisualStock(productId, -1); // Reducir el stock visual
    }
  }

  this.LendingService.setContains(this.contains); // Guardar el estado del carrito
}

decrementQuantity(productId: number) {
  let productContains = this.contains.find(q => q.productId === productId);

  if (productContains && productContains.amount > 0) {
    productContains.amount -= 1;
    this.updateVisualStock(productId, 1); // Aumentar el stock visual
  }

  if (productContains?.amount === 0) {
    this.contains = this.contains.filter(q => q.productId !== productId);
  }

  this.LendingService.setContains(this.contains);
}


  updateVisualStock(productId: number, change: number) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.stock += change; // Modifica el stock visualmente
    }
  }


  decreaseStock(productId: number) {
    const product = this.products.find(p => p.id === productId);
    if (product && product.stock > 0) {
      product.stock -= 1;
    }
  }

  hasSelectedProduct(): boolean {
    return this.contains.some(item => item.amount >= 0);
  }


  getProducts(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.LendingService.setSelectedUser(user);
    console.log('Usuario seleccionado:', this.selectedUser);
  }


  selectTeacher(teacher: UserTeacher) {
    this.selectedTeacher = teacher;
    console.log('Profesor seleccionado:', this.selectedTeacher);
  }


  selectUserType(type: string) {
    this.selectedUserType = type;
  }

  public getDegree(code: string) {
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
    this.userService.getAllAssistants().subscribe((assistants: UserAssitant[]) => {
      this.assistants = assistants;
      this.filteredAssistants = assistants;
    });
  }

  private getAllDegrees() {
    this.userService.getAllDegrees().subscribe((degrees: Degree[]) => {
      this.degrees = degrees;
    });
  }

  stepUp(){
    this.currentStep++;
    this.LendingService.setCurrentStep(this.currentStep);
  }

  stepDown(){
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
      id: null,
      date: null,
      state: null,
      comments: this.comments || null,
      borrowerId: this.selectedUser?.id,
      teacherId: this.selectedTeacher?.id || null,
      contains: this.contains
    };

    console.log(this.lending);

    this.LendingService.addLending(this.lending).subscribe({
      next: () => {
        console.log(this.lending);
        this.initializeLendingForm();
      },
      error: (error) => {
        alert(error.error.message);
      },
    });
  }


  onSearch() {
    this.searchService.updateSearchTerm(this.searchTerm);
  }


  initializeLendingForm() {
    this.currentStep = 1;
    this.comments = "";
    this.selectedUser = null;
    this.selectedTeacher = null;
    this.contains = [];
    this.LendingService.setContains(null);
    this.LendingService.setSelectedUser(null);
  }


  cancel(){
    this.initializeLendingForm();
    this.LendingService.setCurrentStep(1);
  }


}
