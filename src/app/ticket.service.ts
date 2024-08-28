import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

@Injectable({
  providedIn: 'root',
})
export class PdfParserService {
  constructor() {
    GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.mjs';
  }

  async parsePdf(pdfBuffer: ArrayBuffer): Promise<any[]> {
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
    const pdf = await loadingTask.promise;
    let allItems: any[] = [];
    let items: any[] = [];
    let capturing = false;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      textContent.items.forEach((item: any) => {
        if ('str' in item) {
          const text = item.str.trim();
          if (text === '----------------------------------------') {
            capturing = !capturing;
            if (!capturing) {
              allItems.push(...this.processText(items));
              items = [];
            }
          } else if (capturing && text && !text.includes('DNI Socio-Cliente')) {
            items.push(text);
          }
        }
      });
    }
    return allItems;
  }

  private processText(textItems: string[]): any[] {
    let results = [];
    let i = 0;
    while (i < textItems.length) {
      let producto = '';
      let cantidad = '';
      let precio = '';

      while (
        i < textItems.length &&
        isNaN(Number(textItems[i].replace(',', '.')))
      ) {
        producto += (producto ? ' ' : '') + textItems[i];
        i++;
      }

      if (
        i < textItems.length &&
        !isNaN(Number(textItems[i].replace(',', '.')))
      ) {
        precio = textItems[i];
        i++;
      }
      if (
        i < textItems.length &&
        !isNaN(Number(textItems[i].replace(',', '.')))
      ) {
        cantidad = textItems[i];
        i++;
      }

      if (producto && cantidad && precio) {
        results.push({ producto, cantidad, precio });
      }
    }
    return results;
  }
}
