import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { IndexedDbService } from '../../services/indexed-db.service';

@Component({
  selector: 'app-select-list',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.css'],
})
export class SelectListComponent implements OnInit {
  isOpen = false;
  selectedText = 'Выбрано: 0 воронок, 0 этапов';

  commonSteps = [
    { name: 'Неразобранное', selected: false, color: '#A5C9F3' },
    { name: 'Переговоры', selected: false, color: '#FDF49C' },
    { name: 'Принимают решение', selected: false, color: '#FBC794' },
    { name: 'Успешно', selected: false, color: '#C6F9A5' },
  ];

  funnels = [
    { name: 'Продажи', expanded: false, steps: this.cloneSteps() },
    { name: 'Сотрудники', expanded: false, steps: this.cloneSteps() },
    { name: 'Партнёры', expanded: false, steps: this.cloneSteps() },
    { name: 'Ивент', expanded: false, steps: this.cloneSteps() },
    { name: 'Входящие обращения', expanded: false, steps: this.cloneSteps() },
  ];

  constructor(private indexedDbService: IndexedDbService) {}

  ngOnInit() {
    this.indexedDbService.getSelection('funnels').then((savedFunnels) => {
      if (savedFunnels) {
        this.funnels = savedFunnels;
        this.updateSelection();
      }
    });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  updateSelection() {
    let funnelsCount = 0;
    let stepsCount = 0;

    this.funnels.forEach((funnel) => {
      const selectedSteps = funnel.steps.filter((step) => step.selected).length;
      if (selectedSteps > 0) {
        funnelsCount++;
        stepsCount += selectedSteps;
      }
    });

    this.selectedText = `Выбрано: ${funnelsCount} воронок, ${stepsCount} этапов`;

    this.indexedDbService.saveSelection('funnels', this.funnels);
  }

  selectAll(funnelIndex: number) {
    const funnel = this.funnels[funnelIndex];
    funnel.steps.forEach((step) => (step.selected = true));
    this.updateSelection();
  }

  clearAll(funnelIndex: number) {
    const funnel = this.funnels[funnelIndex];
    funnel.steps.forEach((step) => (step.selected = false));
    this.updateSelection();
  }

  @HostListener('document:click', ['$event.target'])
  onOutsideClick(target: HTMLElement) {
    if (!target.closest('.dropdown')) {
      this.isOpen = false;
    }
  }

  private cloneSteps() {
    return this.commonSteps.map((step) => ({ ...step }));
  }
}
