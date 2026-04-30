import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  // Injection des données du dialog
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}

  // Obtenir l'icône selon le type de dialog
  getIcon(): string {
    const icons: Record<string, string> = {
      danger:  'delete_forever',
      warning: 'warning',
      info:    'info'
    };
    return icons[this.data.type ?? 'danger'] ?? 'help';
  }
}
