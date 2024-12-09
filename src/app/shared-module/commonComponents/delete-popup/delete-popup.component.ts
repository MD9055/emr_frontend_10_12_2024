import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent implements OnInit {
  @Input() show: boolean = false;
  @Output() confirmDelete: EventEmitter<void> = new EventEmitter();
  @Output() cancelDelete: EventEmitter<void> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onConfirm() {
    this.confirmDelete.emit();
    this.show = false;  // Optional: Hide the popup after confirmation
  }

  onCancel() {
    this.cancelDelete.emit();
    this.show = false;  // Optional: Hide the popup on cancel
  }
}
