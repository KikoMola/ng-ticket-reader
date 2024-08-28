import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdfParserService } from './ticket.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  providers: [PdfParserService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  parsedData: any[] = [];

  constructor(private pdfParserService: PdfParserService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const arrayBuffer = e.target.result;
        this.parsedData = await this.pdfParserService.parsePdf(arrayBuffer);
        console.log(this.parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
  }
}
