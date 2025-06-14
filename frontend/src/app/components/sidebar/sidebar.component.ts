import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <img src="/icons/workly-icon.svg" alt="Workly" class="logo-image" />
          </div>
        </div>
      </div>

      <div class="sidebar-content"></div>

      <div class="sidebar-footer">
        <div class="contact-section">
          <h3 class="contact-title">Chat with us</h3>
          <p class="contact-subtitle">Lorem ipsum dolor sit amet.</p>
          <div class="contact-email">
            <img src="/icons/email-icon.svg" alt="Email" class="email-icon" />
            <span class="email-text">info&#64;theworkly.eu</span>
          </div>
        </div>

        <div class="social-links">
          <a href="#" class="social-link linkedin">
            <img
              src="/icons/linkedin-icon.svg"
              alt="LinkedIn"
              class="linkedin-icon"
            />
          </a>
        </div>
      </div>
    </aside>
  `,
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {}
