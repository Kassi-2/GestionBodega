import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-lending-options',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './lending-options.component.html',
  styleUrl: './lending-options.component.css'
})
export class LendingOptionsComponent {
  selectedCategory!: string;

  constructor( private cdr: ChangeDetectorRef,   private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      const currentCategory = urlSegments[1]?.path;
      if (currentCategory) {
        this.selectedCategory = currentCategory;
      }
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
}
