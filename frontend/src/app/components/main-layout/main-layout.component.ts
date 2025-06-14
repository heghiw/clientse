import { Component } from "@angular/core";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { DocumentPortalComponent } from "../document-portal/document-portal.component";

@Component({
  selector: "app-main-layout",
  standalone: true,
  imports: [SidebarComponent, DocumentPortalComponent],
  template: `
    <div class="main-layout">
      <app-sidebar class="sidebar"></app-sidebar>
      <main class="main-content">
        <app-document-portal></app-document-portal>
      </main>
    </div>
  `,
  styleUrl: "./main-layout.component.scss",
})
export class MainLayoutComponent {}
