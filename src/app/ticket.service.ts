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

  async parsePdfConsum(pdfBuffer: ArrayBuffer): Promise<any[]> {
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
              allItems.push(...this.processTextConsum(items));
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

  private processTextConsum(textItems: string[]): any[] {
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

  async parsePdfMercadona(pdfBuffer: ArrayBuffer): Promise<any[]> {
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
    const pdf = await loadingTask.promise;
    let capturing = false;
    let capturedText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      for (const item of textContent.items) {
        if ('str' in item) {
          let text = item.str.trim();
          if (text.includes('Importe')) {
            capturing = true;
            continue;
          }
          if (text.includes('TOTAL (€)')) {
            if (capturing) {
              const processedProducts = this.processTextMercadona(
                capturedText.trim()
              );
              return processedProducts;
            }
            break;
          }
          if (capturing && text) {
            const match = text.match(/^(\d+)\s(.*)$/);
            if (match) {
              text = match[1] + '\n' + match[2];
            }
            capturedText += text + '\n';
          }
        }
      }
    }
    if (!capturedText.trim()) {
      console.log("No relevant text found between 'Importe' and 'TOTAL (€)'.");
    }
    return [];
  }

  private processTextMercadona(capturedText: string): any[] {
    const lines = capturedText.split('\n').filter((line) => line.trim() !== '');
    const products = [];
    let i = 0;

    while (i < lines.length) {
      const cantidad = parseInt(lines[i].trim());
      const nombre = lines[i + 1].trim();
      let precioUnitario, precioTotal;
      if (i + 2 < lines.length && /[\d,\.]+\d{2}$/.test(lines[i + 2])) {
        precioUnitario = parseFloat(lines[i + 2].trim().replace(',', '.'));
        if (i + 3 < lines.length && /[\d,\.]+\d{2}$/.test(lines[i + 3])) {
          precioTotal = parseFloat(lines[i + 3].trim().replace(',', '.'));
          i += 4;
        } else {
          precioTotal = precioUnitario;
          i += 3;
        }
      } else {
        precioTotal = parseFloat(lines[i + 2].trim().replace(',', '.'));
        precioUnitario = precioTotal;
        i += 3;
      }

      const product = {
        cantidad,
        nombre,
        precioUnitario,
        precioTotal,
      };
      products.push(product);
    }

    return products;
  }
}
