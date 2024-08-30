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
    let capturedText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      let pageText = '';

      for (const item of textContent.items) {
        if ('str' in item && item.str.trim() !== '') {
          pageText += item.str.trim() + ' ';
        }
      }

      const start = pageText.indexOf('----------------------------------------') + '----------------------------------------'.length + 1;
      const end = pageText.indexOf('Socio-Cliente', start);
      if (start !== -1 && end !== -1) {
        capturedText += pageText.substring(start, end).trim() + ' ';
      } else {
        console.log(`No se encontraron los delimitadores en la página ${pageNum}`);
      }
    }

    if (capturedText.trim()) {
      return this.processTextConsum(capturedText.trim());
    } else {
      console.log("No se encontró texto relevante entre los delimitadores.");
      return [];
    }
  }

  private processTextConsum(capturedText: string): any[] {
    const lines = capturedText.split(/\s+/);
    const products = [];
    let i = 0;

    while (i < lines.length) {
      const cantidad = parseFloat(lines[i].trim());
      let nombre = '';
      let precioUnitario = 0;
      let precioTotal = 0;
      let sc = '0';

      i++;
      while (i < lines.length && !/^\d+,\d{2}$/.test(lines[i])) {
        nombre += lines[i] + ' ';
        i++;
      }
      nombre = nombre.trim();

      if (i < lines.length && /^\d+,\d{2}$/.test(lines[i])) {
        precioTotal = parseFloat(lines[i].replace(',', '.'));
        i++;
      }

      if (cantidad === 1) {
        precioUnitario = precioTotal;
      } else if (i < lines.length && /^\d+,\d{2}$/.test(lines[i])) {
        precioUnitario = parseFloat(lines[i].replace(',', '.'));
        i++;
      }

      if (i < lines.length && /^\d+,\d{2}$/.test(lines[i])) {
        sc = lines[i];
        i++;
      }

      const product = {
        cantidad,
        nombre,
        precioUnitario,
        precioTotal
      };
      products.push(product);
    }

    return products;
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
