import { ChangeDetectorRef, Component } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from "../../products/add-product/add-product.component";
import { UserAddComponent } from "../user-add/user-add.component";
import { UsersImportComponent } from "../users-import/users-import.component";
import { UserSendQrComponent } from "../user-send-qr/user-send-qr.component";


@Component({
  selector: 'app-user-options',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, UserAddComponent, UsersImportComponent, UserSendQrComponent],
  templateUrl: './user-options.component.html',
  styleUrl: './user-options.component.css',
})
export class UserOptionsComponent {
  searchTerm: string = '';
  selectedCategory!: string;

  constructor(private searchService: SearchService, private router: Router, private cdr: ChangeDetectorRef,   private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      const currentCategory = urlSegments[1]?.path;
      if (currentCategory) {
        this.selectedCategory = currentCategory;
      }
    });
  }

  onSearch() {
    this.searchService.updateSearchTerm(this.searchTerm);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.router.navigate([`/users/${category}`]);
  }
}
