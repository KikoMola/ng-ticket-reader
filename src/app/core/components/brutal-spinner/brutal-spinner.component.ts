import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  type OnInit,
} from '@angular/core';

@Component({
  selector: 'app-brutal-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brutal-spinner.component.html',
  styles: [
    `
      .spinner-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
        backdrop-filter: blur(5px); /* Aplicar blur al fondo */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999; /* Asegurarse de que esté por encima de todo */
      }

      .spinner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: white;
        padding: 20px;
        border: 2px solid #001e2b;
        position: relative;
      }

      .spinner-container::before {
        content: '';
        position: absolute;
        top: 4px;
        left: 4px;
        width: 100%;
        height: 100%;
        background-color: #001e2b;
        z-index: -1;
      }

      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      p {
        color: #001e2b;
        font-weight: bold;
        margin-top: 10px;
        text-transform: uppercase;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrutalSpinnerComponent {
  @Input() message: string = 'Cargando...';
}
