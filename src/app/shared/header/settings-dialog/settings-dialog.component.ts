import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent {
  @Output() close = new EventEmitter<void>();

  public closeDialog() {
    this.close.emit();
  }
  @Output() hideLeftChanged = new EventEmitter<boolean>();
  @Output() hideRightChanged = new EventEmitter<boolean>();

  hideLeft = false; // State variable for left-hand side
  hideRight = false; // State variable for right-hand side

  // ... existing methods ...

  toggleLeft() {
    this.hideLeft = !this.hideLeft;
    this.hideLeftChanged.emit(this.hideLeft);
  }

  toggleRight() {
    this.hideRight = !this.hideRight;
    this.hideRightChanged.emit(this.hideRight);
  }
}
