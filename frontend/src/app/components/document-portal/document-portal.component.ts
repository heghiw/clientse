import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { FileUploadComponent } from "../file-upload/file-upload.component";

@Component({
  selector: "app-document-portal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileUploadComponent],
  template: `
    <div class="document-portal">
      <header class="portal-header">
        <h1 class="portal-title">Contractor Document Portal</h1>
        <p class="portal-subtitle">
          Please complete the following fields and upload your documents.
        </p>
      </header>

      <form [formGroup]="documentForm" class="portal-form">
        <div class="form-group">
          <label for="clientId" class="form-label">Client ID</label>
          <input
            type="text"
            id="clientId"
            formControlName="clientId"
            class="form-input"
            placeholder="Enter client ID"
          />
        </div>

        <div class="candidate-section">
          <div class="candidate-header">
            <div class="candidate-avatar">
              <img
                src="/icons/candidate-icon.svg"
                alt="Candidate"
                class="candidate-icon"
              />
            </div>
            <span class="candidate-title">Candidate 1</span>
          </div>

          <div class="candidate-form">
            <div class="form-group">
              <label for="candidateId" class="form-label">Candidate ID</label>
              <input
                type="text"
                id="candidateId"
                formControlName="candidateId"
                class="form-input"
                placeholder="Ex. 2938495"
              />
            </div>

            <div class="form-group">
              <label for="month" class="form-label">Month</label>
              <select id="month" formControlName="month" class="form-select" required>
                <option value="">Select the month</option>
                <option value="january">January</option>
                <option value="february">February</option>
                <option value="march">March</option>
                <option value="april">April</option>
                <option value="may">May</option>
                <option value="june">June</option>
                <option value="july">July</option>
                <option value="august">August</option>
                <option value="september">September</option>
                <option value="october">October</option>
                <option value="november">November</option>
                <option value="december">December</option>
              </select>
            </div>

            <div class="upload-section">
              <div class="form-group">
                <label class="form-label">Invoice</label>
                <app-file-upload
                  [accept]="'.pdf,.doc,.docx'"
                  [maxSize]="10"
                  (fileSelected)="onInvoiceFileSelected($event)"
                  [uploadProgress]="invoiceUploadProgress"
                  [fileName]="invoiceFileName"
                >
                </app-file-upload>
              </div>

              <div class="form-group">
                <label class="form-label">Timesheet</label>
                <app-file-upload
                  [accept]="'.pdf,.doc,.docx,.xls,.xlsx'"
                  [maxSize]="10"
                  (fileSelected)="onTimesheetFileSelected($event)"
                  [uploadProgress]="timesheetUploadProgress"
                  [fileName]="timesheetFileName"
                >
                </app-file-upload>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrl: "./document-portal.component.scss",
})
export class DocumentPortalComponent {
  documentForm: FormGroup;
  invoiceUploadProgress: number = 0;
  timesheetUploadProgress: number = 0;
  invoiceFileName: string = "";
  timesheetFileName: string = "";

  constructor(private formBuilder: FormBuilder) {
    this.documentForm = this.formBuilder.group({
      clientId: ["", [Validators.required]],
      candidateId: ["", [Validators.required]],
      month: ["", [Validators.required]],
    });
  }

  onInvoiceFileSelected(file: File): void {
    this.invoiceFileName = file.name;
    this.simulateUpload("invoice");
  }

  onTimesheetFileSelected(file: File): void {
    this.timesheetFileName = file.name;
    this.simulateUpload("timesheet");
  }

  private simulateUpload(type: "invoice" | "timesheet"): void {
    const progressProperty =
      type === "invoice" ? "invoiceUploadProgress" : "timesheetUploadProgress";
    this[progressProperty] = 0;

    const interval = setInterval(() => {
      this[progressProperty] += Math.random() * 15;
      if (this[progressProperty] >= 100) {
        this[progressProperty] = 100;
        clearInterval(interval);
      }
    }, 200);
  }
}
