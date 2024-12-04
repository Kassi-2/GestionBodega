import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trash-options',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './trash-options.component.html',
  styleUrl: './trash-options.component.css'
})
export class TrashOptionsComponent {
  selectedCategory!: string;

  constructor( private cdr: ChangeDetectorRef,   private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      const currentCategory = urlSegments[urlSegments.length - 1]?.path; // Obtiene la última parte de la URL
      if (currentCategory) {
        this.selectedCategory = currentCategory;
      }
    });
  }


  selectCategory(category: string): void {
    this.selectedCategory = category;
    console.log(this.selectedCategory)
    this.cdr.detectChanges(); // Forzar la detección de cambios

  }
}
