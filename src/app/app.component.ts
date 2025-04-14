import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  code: string = '';
  language: string = 'python';
  iframeUrl?: SafeResourceUrl;
  loading: boolean = false;
  errorMsg: string = '';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  generateChart() {
    this.loading = true;
    this.errorMsg = '';
    this.iframeUrl = undefined;

    this.http.post<{ url: string }>('http://127.0.0.1:5000/execute', {
      language: this.language,
      code: this.code
    }).subscribe({
      next: (res) => {
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Failed to execute script';
        this.loading = false;
      }
    });
  }
}
