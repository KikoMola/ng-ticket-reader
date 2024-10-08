import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdfParserService } from './core/services/ticket.service';
import { JsonPipe } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  providers: [PdfParserService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent { }
