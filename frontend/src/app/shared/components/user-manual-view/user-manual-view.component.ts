import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-manual-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-manual-view.component.html',
  styleUrls: ['./user-manual-view.component.css']
})
export class UserManualViewComponent implements OnInit {
  pdfUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const pdfPath = 'assets/pdf/estudiantes-2024-11-26.pdf';
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfPath);
  }
}
