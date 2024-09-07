import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { PdfParserService } from '../../core/services/ticket.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrutalSpinnerComponent } from '../../core/components/brutal-spinner/brutal-spinner.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BrutalSpinnerComponent],
  templateUrl: './landing.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('dropArea') dropArea!: ElementRef;
  form!: FormGroup;
  files: { name: string; size: string }[] = [];
  notScanned: boolean = true;
  isLoading: boolean = false;
  parsedData: any[] = [];

  constructor(
    private _pdfParserService: PdfParserService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef
  ) {
    initFlowbite();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this._fb.group({
      storeSelection: [''],
    });
  }

  showForm() {
    console.log(this.form.get('storeSelection')?.value);
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
        if (this.form.get('storeSelection')?.value === 'consum') {
          this.onFileSelectedConsum(file);
        } else if (this.form.get('storeSelection')?.value === 'mercadona') {
          this.onFileSelectedMercadona(file);
        } else {
          alert('Tienes que seleccionar un supermercado');
          return;
        }
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
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        if (this.form.get('storeSelection')?.value === 'consum') {
          this.onFileSelectedConsum(file);
        } else if (this.form.get('storeSelection')?.value === 'mercadona') {
          this.onFileSelectedMercadona(file);
        } else {
          alert('Tienes que seleccionar un supermercado');
          return;
        }
        this.files.push({
          name: file.name,
          size: this.formatBytes(file.size),
        });
      } else {
        alert('Solo se permiten archivos PDF');
      }
    }
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

  // onFileSelectedConsum(file: File) {
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = async (e: any) => {
  //       const arrayBuffer = e.target.result;
  //       this.parsedData = await this._pdfParserService.parsePdfConsum(
  //         arrayBuffer
  //       );
  //       this.notScanned = false;
  //       this._cdr.markForCheck(); // Marca el componente para ser verificado
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // }

  // onFileSelectedMercadona(file: File) {
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = async (e: any) => {
  //       const arrayBuffer = e.target.result;
  //       this.parsedData = await this._pdfParserService.parsePdfMercadona(
  //         arrayBuffer
  //       );
  //       this.notScanned = false;
  //       this._cdr.markForCheck(); // Marca el componente para ser verificado
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // }

  private processFile(
    file: File,
    parseMethod: (buffer: ArrayBuffer) => Promise<any>
  ) {
    this.isLoading = true;
    this._cdr.markForCheck();

    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const arrayBuffer = e.target.result;

      // Simular un tiempo de carga entre 1 y 3 segundos
      const delay = Math.floor(Math.random() * 2000) + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      this.parsedData = await parseMethod(arrayBuffer);
      this.notScanned = false;
      this.isLoading = false;
      this._cdr.markForCheck();
    };
    reader.readAsArrayBuffer(file);
  }

  onFileSelectedConsum(file: File) {
    this.processFile(
      file,
      this._pdfParserService.parsePdfConsum.bind(this._pdfParserService)
    );
  }

  onFileSelectedMercadona(file: File) {
    this.processFile(
      file,
      this._pdfParserService.parsePdfMercadona.bind(this._pdfParserService)
    );
  }
}
