
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [],
  templateUrl: './faqs.component.html',
  styles: `
    .faq-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

@media (min-width: 640px) {
  .faq-container {
    padding: 2rem;
  }
}

.faq-item {
  margin-bottom: 1rem;
  position: relative;
}

.faq-question {
  position: relative;
  z-index: 1;
}

.faq-answer {
  position: relative;
  z-index: 1;
  margin-top: 0.5rem;
}

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FaqsComponent implements OnInit {
  ngOnInit(): void {}

  faqs = [
    {
      question: '¿Cómo puedo subir un archivo?',
      answer:
        'Para subir un archivo, simplemente arrastra y suelta el archivo PDF en el área designada o haz clic para seleccionarlo desde tu dispositivo.',
    },
    {
      question: '¿Qué tipo de archivos puedo subir?',
      answer:
        'Solo se permiten archivos en formato PDF. Asegúrate de que el archivo que estás subiendo sea un PDF válido.',
    },
    {
      question: '¿Cuánto tiempo tarda en procesarse mi archivo?',
      answer:
        'El procesamiento del archivo puede tardar entre 1 y 3 segundos, dependiendo del tamaño del archivo.',
    },
  ];

  activeFaq: number | null = null;

  toggleFaq(index: number) {
    this.activeFaq = this.activeFaq === index ? null : index;
  }
}
