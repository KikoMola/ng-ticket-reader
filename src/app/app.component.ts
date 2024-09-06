import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdfParserService } from './core/services/ticket.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, CommonModule],
  providers: [PdfParserService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('dropArea') dropArea!: ElementRef;
  files: { name: string; size: string }[] = [];
  parsedData: any[] = [];

  constructor(private pdfParserService: PdfParserService) {
    initFlowbite();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.highlight();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.unhighlight();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.unhighlight();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        this.onFileSelectedConsum(file);
        this.files.push({
          name: file.name,
          size: this.formatBytes(file.size),
        });
      } else {
        alert('Solo se permiten archivos PDF');
      }
    }
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const files = element.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  private handleFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf') {
        this.files.push({
          name: file.name,
          size: this.formatBytes(file.size),
        });
      } else {
        alert('Solo se permiten archivos PDF');
      }
    });
  }

  private highlight() {
    this.dropArea.nativeElement.style.borderColor = '#00ED64';
  }

  private unhighlight() {
    this.dropArea.nativeElement.style.borderColor = '#001E2B';
  }

  private formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onFileSelectedConsum(file: File) {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const arrayBuffer = e.target.result;
        this.parsedData = await this.pdfParserService.parsePdfConsum(
          arrayBuffer
        );
      };
      reader.readAsArrayBuffer(file);
    }
  }

  onFileSelectedMercadona(file: File) {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const arrayBuffer = e.target.result;
        this.parsedData = await this.pdfParserService.parsePdfMercadona(
          arrayBuffer
        );
      };
      reader.readAsArrayBuffer(file);
    }
  }
}
