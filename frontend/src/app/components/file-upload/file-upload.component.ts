import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-file-upload",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-upload-container">
      <label
        class="file-upload-area"
        [class.has-file]="fileName"
        [class.uploading]="uploadProgress > 0 && uploadProgress < 100"
        [class.drag-active]="dragActive"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (dragenter)="onDragEnter($event)"
        (drop)="onDrop($event)"
        (click)="openFileDialog()"
      >
        <input
          #fileInput
          type="file"
          class="file-input"
          [accept]="accept"
          (change)="onFileSelected($event)"
          hidden
        />

        <div class="upload-content" *ngIf="!fileName">
          <div class="upload-icon">
            <img
              src="/icons/upload-icon.svg"
              alt="Upload"
              class="upload-image"
            />
          </div>
          <p class="upload-text">
            <span class="upload-main-text">Drag & drop files here or click to browse</span>
            <br />
            <span class="upload-sub-text"
              >Max file size up to {{ maxSize }}GB</span
            >
          </p>
        </div>

        <div class="file-info" *ngIf="fileName">
          <div class="file-details">
            <div class="file-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 2V8H20"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="file-text">
              <span class="file-name">{{ fileName }}</span>
              <span class="file-type">{{
                getFileExtension(fileName) | uppercase
              }}</span>
            </div>
          </div>

          <button
            type="button"
            class="remove-file-btn"
            (click)="removeFile($event)"
            *ngIf="uploadProgress === 0 || uploadProgress === 100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div
          class="upload-progress"
          *ngIf="uploadProgress > 0 && uploadProgress < 100"
        >
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="uploadProgress"></div>
          </div>
          <div class="progress-info">
            <span class="progress-text">Uploading...</span>
            <span class="progress-percentage"
              >{{ Math.round(uploadProgress) }}%</span
            >
          </div>
          <span class="progress-time">33 seconds remaining</span>
        </div>
      </label>
    </div>
  `,
  styleUrl: "./file-upload.component.scss",
})
export class FileUploadComponent {
  @Input() accept: string = "*/*";
  private _maxSize: number = 1; // in GB

  @Input()
  set maxSize(value: number) {
    const parsed = Number(value);
    this._maxSize = isNaN(parsed) ? 1 : Math.min(parsed, 1);
  }
  get maxSize(): number {
    return this._maxSize;
  }
  @Input() uploadProgress: number = 0;
  @Input() fileName: string = "";
  @Output() fileSelected = new EventEmitter<File>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  Math = Math;
  dragActive: boolean = false;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.validateFile(file)) {
      this.fileSelected.emit(file);
    }
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = true;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    // Only set dragActive to false if we're actually leaving the upload area
    // and not just entering a child element
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      this.dragActive = false;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.validateFile(file)) {
        this.fileSelected.emit(file);
      }
    }
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.fileName = "";
    // Reset file input
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = "";
    }
  }

  getFileExtension(fileName: string): string {
    return fileName.split(".").pop() || "";
  }

  private validateFile(file: File): boolean {
    // Check file size (convert maxSize from GB to bytes)
    const maxSizeBytes = this.maxSize * 1024 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`File size exceeds ${this.maxSize}GB limit`);
      return false;
    }

    // Check file type if accept is specified
    if (this.accept !== "*/*") {
      const acceptedTypes = this.accept.split(",").map((type) => type.trim());
      const fileExtension =
        "." + this.getFileExtension(file.name).toLowerCase();
      const isAccepted = acceptedTypes.some(
        (type) =>
          type === fileExtension ||
          (type.includes("*") && file.type.match(type.replace("*", ".*"))),
      );

      if (!isAccepted) {
        alert(`File type not accepted. Accepted types: ${this.accept}`);
        return false;
      }
    }

    return true;
  }

  openFileDialog(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }
}
