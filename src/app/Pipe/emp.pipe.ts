import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusToTag',
  standalone: true
})
export class StatusToTagPipe implements PipeTransform {
  transform(status: string): string | undefined {
    switch (status) {
      case 'unqualified': return 'danger';
      case 'qualified': return 'success';
      case 'new': return 'info';
      case 'negotiation': return 'warning';
      case 'renewal': return 'secondary';
      default: return 'secondary';
    }
  }
}
