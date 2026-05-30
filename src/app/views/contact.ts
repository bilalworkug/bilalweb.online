import { ChangeDetectionStrategy, Component, OnInit, signal, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { DataState } from '../services/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  template: `
    <section class="max-w-4xl mx-auto py-8 space-y-12 animate-slide-up text-left font-sans">
      <div class="space-y-4 max-w-3xl text-left">
        <div class="small-label text-accent-gold">Start Today</div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1f2b1d] uppercase tracking-tight" id="contact-title">
          Let's Craft Your Digital Storefront
        </h1>
        <p class="text-xs sm:text-sm text-[#778575] leading-relaxed max-w-2xl" id="contact-subtext">
          Have an exciting project draft in Kampala or across East Africa? Get in touch with Bilal today. Fill out our custom spec sheets below, or send me a WhatsApp message for an immediate session.
        </p>
      </div>

      <!-- Quick WhatsApp Action Banner with Handcrafted Minimal Styling -->
      <div id="contact-whatsapp-banner" class="bg-[#fcfaf6] border border-[#eae6dd] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs text-left">
        <div class="flex items-start space-x-4">
          <div class="p-3 bg-white border border-[#eae6dd] rounded-2xl text-accent-gold flex-shrink-0">
            <svg class="icon icon-md text-accent-gold animate-pulse" id="wa-balloon"><use href="#icon-whatsapp"/></svg>
          </div>
          <div>
            <h4 class="text-lg font-bold text-[#1f2b1d] uppercase tracking-tight">Immediate Project Fast-Track</h4>
            <p class="text-xs text-[#778575] leading-relaxed">Let's coordinate specifications directly on WhatsApp. Bilal is live and ready to consult.</p>
          </div>
        </div>
        <a [href]="whatsappLink()" target="_blank" rel="noopener noreferrer" id="wa-direct-btn" class="btn-premium-primary text-xs uppercase tracking-widest font-bold bg-[#2e7d32] hover:bg-[#1b5e20] text-white flex items-center justify-center space-x-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0 transition-transform hover:-translate-y-0.5 duration-150">
          <svg class="icon text-white" style="width:18px; height:18px;"><use href="#icon-whatsapp"/></svg>
          <span>WhatsApp Chat</span>
        </a>
      </div>

      <!-- Main Form Container -->
      <div class="bg-[#fcfaf6] border border-[#eae6dd] shadow-sm rounded-2xl p-6 sm:p-12 text-left" id="contact-form-container">
        
        <!-- Submission Results State -->
        @if (submitSuccess()) {
          <div id="contact-success-state" class="text-center py-6 space-y-5">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-[#eae6dd] text-[#bf5d39] rounded-full border border-[#ece3ca]">
              <svg class="w-8 h-8 font-extrabold animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div class="space-y-2">
              <h3 class="text-2xl font-black text-[#1f2b1d] uppercase tracking-tight leading-snug">Inquiry Saved Successfully</h3>
              <p class="text-[#778575] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Thank you. Your details have been registered securely on our cloud server.
              </p>
            </div>
            
            @if (whatsappRedirectUrl()) {
              <div class="bg-white border border-[#eae6dd] p-6 rounded-2xl max-w-md mx-auto space-y-4 shadow-xs text-left">
                <p class="text-xs text-[#4d594b] leading-relaxed">
                  🚀 PRE-FILL THE CHAT: Click the button below to pre-populate your exact parameters directly into WhatsApp to double check with me now!
                </p>
                <a [href]="whatsappRedirectUrl()" target="_blank" rel="noopener noreferrer" class="w-full bg-[#bf5d39] hover:bg-[#9e4624] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-transform hover:-translate-y-0.5 duration-150 shadow-md">
                  <svg class="icon text-white" style="width:18px; height:18px;"><use href="#icon-whatsapp"/></svg>
                  <span class="text-xs uppercase tracking-widest font-bold">Transmit Project Spec Details</span>
                </a>
              </div>
            }

            <button (click)="submitSuccess.set(null)" class="text-xs text-[#bf5d39] hover:underline font-bold mt-4 block mx-auto font-mono uppercase tracking-wider">
              ← Register another custom inquiry spec sheet
            </button>
          </div>
        } @else {
          
          <!-- FormGroup setup with peer focus bottom labels -->
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-10" id="contact-form">
            <div class="space-y-2 text-left pb-4 border-b border-[#eae6dd] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span class="small-label text-accent-gold">Spec Sheet Registration</span>
                <h3 class="text-xl font-bold text-[#1f2b1d] uppercase tracking-tight">Configure Your Project</h3>
              </div>
              @if (draftLastSaved()) {
                <div class="flex items-center space-x-1.5 self-start sm:self-center bg-emerald-50/70 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider py-1 px-2.5 rounded-lg border border-emerald-100/60" id="autosave-badge">
                  <span class="relative flex h-1.5 w-1.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span>Draft Autosaved</span>
                </div>
              }
            </div>
            
            @if (submitError()) {
              <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs text-left flex items-center space-x-2">
                <svg class="icon icon-sm text-red-650 flex-shrink-0" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <span>{{ submitError() }}</span>
              </div>
            }

            <!-- Name field with floating bottom border (terracotta on focus) -->
            <div class="relative w-full text-left" id="field-group-name">
              <input 
                type="text" 
                id="customer-name" 
                formControlName="name" 
                placeholder=" " 
                class="peer w-full bg-transparent pt-6 pb-2 border-b border-[#eae6dd] focus:border-[#bf5d39] focus:ring-0 outline-none text-sm transition-all text-[#1f2b1d] font-semibold"
              />
              <label for="customer-name" class="absolute left-0 top-6 text-xs text-[#778575] font-bold uppercase tracking-wider transition-all duration-250 pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-6 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#bf5d39] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#bf5d39]">
                Your Full Name <span class="text-[#bf5d39]">*</span>
              </label>
              @if (contactForm.get('name')?.touched && contactForm.get('name')?.invalid) {
                <div class="text-[#bf5d39] text-[10px] font-bold mt-1 font-mono uppercase tracking-wide">Tell me your name so we can correspond.</div>
              }
            </div>

            <!-- Business Name field with floating bottom border -->
            <div class="relative w-full text-left" id="field-group-business">
              <input 
                type="text" 
                id="customer-business" 
                formControlName="businessName" 
                placeholder=" " 
                class="peer w-full bg-transparent pt-6 pb-2 border-b border-[#eae6dd] focus:border-[#bf5d39] focus:ring-0 outline-none text-sm transition-all text-[#1f2b1d] font-semibold"
              />
              <label for="customer-business" class="absolute left-0 top-6 text-xs text-[#778575] font-bold uppercase tracking-wider transition-all duration-250 pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-6 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#bf5d39] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#bf5d39]">
                Business / Enterprise Brand Name
              </label>
            </div>

            <!-- Phone / Email contact details with floating bottom border -->
            <div class="relative w-full text-left" id="field-group-contact">
              <input 
                type="text" 
                id="customer-contact" 
                formControlName="contactInfo" 
                placeholder=" " 
                class="peer w-full bg-transparent pt-6 pb-2 border-b border-[#eae6dd] focus:border-[#bf5d39] focus:ring-0 outline-none text-sm transition-all text-[#1f2b1d] font-semibold"
              />
              <label for="customer-contact" class="absolute left-0 top-6 text-xs text-[#778575] font-bold uppercase tracking-wider transition-all duration-250 pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-6 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#bf5d39] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#bf5d39]">
                Mobile Phone / WhatsApp Number or Email <span class="text-[#bf5d39]">*</span>
              </label>
              @if (contactForm.get('contactInfo')?.touched && contactForm.get('contactInfo')?.invalid) {
                <div class="text-[#bf5d39] text-[10px] font-bold mt-1 font-mono uppercase tracking-wide">Valid contact parameters are required.</div>
              }
            </div>

            <!-- Message field with floating bottom border -->
            <div class="relative w-full text-left" id="field-group-message">
              <textarea 
                id="customer-message" 
                formControlName="message" 
                rows="3"
                placeholder=" " 
                class="peer w-full bg-transparent pt-6 pb-2 border-b border-[#eae6dd] focus:border-[#bf5d39] focus:ring-0 outline-none text-sm transition-all text-[#1f2b1d] resize-y font-semibold"
              ></textarea>
              <label for="customer-message" class="absolute left-0 top-6 text-xs text-[#778575] font-bold uppercase tracking-wider transition-all duration-250 pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-6 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#bf5d39] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#bf5d39]">
                Bespoke Specifications: Describe pages, goals & color preferences <span class="text-[#bf5d39]">*</span>
              </label>
              @if (contactForm.get('message')?.touched && contactForm.get('message')?.invalid) {
                <div class="text-[#bf5d39] text-[10px] font-bold mt-1 font-mono uppercase tracking-wide">Please enter at least 10 characters detailing your idea.</div>
              }
            </div>

            <!-- Submission Button with Terracotta accent -->
            <button 
              type="submit" 
              id="contact-submit-btn" 
              [disabled]="isSubmitting()"
              class="w-full h-14 bg-[#bf5d39] hover:bg-[#9e4624] text-white font-bold uppercase tracking-widest text-[11px] rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 cursor-pointer border-none"
            >
              @if (isSubmitting()) {
                <span class="animate-pulse">Locking Specifications...</span>
              } @else {
                <span>File Specs & Generate Fast-Track Chat Link</span>
              }
            </button>
          </form>
        }

      </div>

      <!-- Call Direct Line -->
      <div class="text-left font-mono text-[11px] max-w-xl border-l-2 border-[#eae6dd] pl-4 py-1 animate-fade-in" id="quick-manual">
        <p class="text-[#778575] font-bold uppercase tracking-widest">Inbound Cellular Support</p>
        <p class="text-[#1f2b1d] font-bold mt-1 text-xs" id="call-direct-line">
          Inbound lines: {{ dataState.whatsappNumber() }}
        </p>
      </div>
    </section>
  `,
  styles: []
})
export class ContactComponent implements OnInit {
  private route = inject(ActivatedRoute);
  dataState = inject(DataState);

  contactForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)]
    }),
    businessName: new FormControl('', {
      nonNullable: true
    }),
    contactInfo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)]
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)]
    })
  });

  isSubmitting = signal(false);
  submitSuccess = signal<string | null>(null);
  submitError = signal<string | null>(null);
  whatsappRedirectUrl = signal<string | null>(null);
  draftLastSaved = signal<string | null>(null);

  private titleService = inject(Title);
  private metaService = inject(Meta);

  constructor() {
    this.titleService.setTitle('Contact Best Web Design Company near me in Kampala Uganda');
    this.metaService.updateTag({ name: 'description', content: 'Contact Bilal Ahmed for top-rated, professional website design near me in Kampala or Uganda. Get a quick WhatsApp consultation, instant responsive layout quotation, and project timeline estimate.' });
    this.metaService.updateTag({ name: 'keywords', content: 'contact website designer near me, website quote Uganda, hire website developer Kampala, web design price quote Kampala, local website design Uganda, professional web developers near me' });
  }

  whatsappLink = computed(() => {
    const raw = this.dataState.whatsappNumber();
    const clean = raw.replace(/\+/g, '').replace(/[^0-9]/g, '');
    return `https://wa.me/${clean}`;
  });

  ngOnInit() {
    // Retreive existing local draft if available
    try {
      const savedDraft = localStorage.getItem('bilal_web_contact_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        this.contactForm.patchValue(parsed, { emitEvent: false });
        this.draftLastSaved.set(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      console.warn('Could not retrieve local draft:', e);
    }

    // Capture explicit service package routes
    this.route.queryParams.subscribe(params => {
      const pkg = params['package'];
      if (pkg) {
        this.contactForm.patchValue({
          message: `Hi Bilal, I need a quote for a "${pkg}". Let's discuss details, timeline, and pricing for my brand!`
        });
      }
    });

    // Reactive listener to auto-persist form edits
    this.contactForm.valueChanges.subscribe(values => {
      try {
        localStorage.setItem('bilal_web_contact_draft', JSON.stringify(values));
        this.draftLastSaved.set(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (e) {
        console.warn('Failed saving local draft automatically:', e);
      }
    });
  }

  async onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.submitError.set('Please fill out all required fields correctly.');
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(null);
    this.submitError.set(null);
    this.whatsappRedirectUrl.set(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.contactForm.getRawValue()),
      });

      if (!res.ok) {
        throw new Error('Server returned error response. Please try again.');
      }

      const data = await res.json();
      
      if (data.success) {
        this.submitSuccess.set('Your request has been saved!');
        const rawNum = this.dataState.whatsappNumber();
        const cleanNum = rawNum.replace(/\+/g, '').replace(/[^0-9]/g, '');
        const fVals = this.contactForm.getRawValue();
        const waMsgTemplate = `Hi Bilal, my name is ${fVals.name}${fVals.businessName ? ` (from ${fVals.businessName})` : ''}. I'm interested in building a website with Bilal Web. Here is my request:\n\n"${fVals.message}"\n\nContact Details: ${fVals.contactInfo}. Let's make it work!`;
        const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(waMsgTemplate)}`;
        
        this.whatsappRedirectUrl.set(whatsappUrl);
        
        // Remove locally saved draft on successful submission
        try {
          localStorage.removeItem('bilal_web_contact_draft');
          this.draftLastSaved.set(null);
        } catch (e) {
          console.warn('Could not clear local draft storage:', e);
        }

        this.contactForm.reset();
      } else {
        throw new Error(data.error || 'Failed to submit request.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      const errMsg = err instanceof Error ? err.message : 'Something went wrong. Please reach Bilal on WhatsApp directly!';
      this.submitError.set(errMsg);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
