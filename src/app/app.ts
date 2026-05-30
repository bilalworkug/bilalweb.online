import { ChangeDetectionStrategy, Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DataState } from './services/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    '(window:scroll)': 'onWindowScroll()'
  }
})
export class App {
  dataState = inject(DataState);

  // Scroll Progress Bar percentage
  scrollProgress = signal('0%');

  constructor() {
    if (typeof window !== 'undefined') {
      setTimeout(() => this.onWindowScroll(), 100);
    }
  }

  onWindowScroll() {
    if (typeof window === 'undefined') return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    this.scrollProgress.set(`${progress}%`);
  }

  // Navigation State
  menuOpen = signal(false);

  // Newsletter Form State
  isSubscribing = signal(false);
  subscribeSuccess = signal(false);
  subscribeError = signal<string | null>(null);

  newsletterForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });

  // Dynamic clean WhatsApp Link
  whatsappLink = computed(() => {
    const rawNum = this.dataState.whatsappNumber();
    const cleanNum = rawNum.replace(/\+/g, '').replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNum}`;
  });

  // Handle subscriber request to join Weekly Blueprints mailing list
  async subscribeNewsletter() {
    if (this.newsletterForm.invalid) {
      this.subscribeError.set('Please enter a valid email address.');
      this.subscribeSuccess.set(false);
      return;
    }

    const email = this.newsletterForm.controls.email.value;
    this.isSubscribing.set(true);
    this.subscribeSuccess.set(false);
    this.subscribeError.set(null);

    // Dynamic elegant latency simulation for upscale professional presentation
    setTimeout(async () => {
      const success = await this.dataState.addSubscriber(email);
      this.isSubscribing.set(false);
      
      if (success) {
        this.subscribeSuccess.set(true);
        this.newsletterForm.reset();
        
        // Hide success alert after 5s
        setTimeout(() => {
          this.subscribeSuccess.set(false);
        }, 5000);
      } else {
        this.subscribeError.set('This email is already in our subscription list.');
      }
    }, 600);
  }

  // Toggle Mobile Menu
  toggleMenu() {
    this.menuOpen.update(prev => !prev);
  }

  // Close Mobile Menu after tap
  closeMenu() {
    this.menuOpen.set(false);
  }
}
