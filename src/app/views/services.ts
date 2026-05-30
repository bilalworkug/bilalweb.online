import { ChangeDetectionStrategy, Component, inject, computed, signal, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DataState } from '../services/data';
import { animate } from 'motion';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-services',
  imports: [RouterLink],
  template: `
    <section class="space-y-16 py-12 animate-slide-up text-left">
      <!-- Simple, Transparent Pricing Intro -->
      <div class="space-y-4 max-w-3xl">
        <div class="small-label text-accent-gold">Our Packages</div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1f2b1d] uppercase tracking-tight" id="services-title">
          Bespoke Plans, Transparent Pricing
        </h1>
        <p class="text-xs sm:text-sm text-[#778575] leading-relaxed max-w-2xl" id="services-intro">
          No hidden developer markups or confusing upfront software fees. Each custom plan delivers genuine professional craftsmanship, fluid mobile-first layouts, and complimentary hosting orientation configurations for your initial business year.
        </p>
      </div>

      <!-- 3 Pricing Cards - Flat design with top terracotta lines and warm beige aesthetics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 items-stretch" id="services-list-grid">
        @for (pkg of dataState.packages(); track pkg.id) {
          <div 
            class="service-card opacity-0 bg-[#fcfaf6] border border-[#eae6dd] text-left flex flex-col justify-between relative rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#bf5d39]/40 shadow-xs"
            [class.border-t-4]="pkg.isMostPopular || pkg.id === 'business'"
            [class.border-t-accent-gold]="pkg.isMostPopular || pkg.id === 'business'"
            [class.md:-translate-y-4]="pkg.isMostPopular || pkg.id === 'business'"
            [class.shadow-md]="pkg.isMostPopular || pkg.id === 'business'"
            [id]="'service-card-' + pkg.id"
          >
            <!-- Content Area -->
            <div class="p-6 sm:p-8 space-y-6 flex-grow text-left">
              <!-- Recommeded top badge -->
              @if (pkg.isMostPopular || pkg.id === 'business') {
                <div class="absolute -top-3.5 right-6 bg-accent-gold text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  Recommended Plan
                </div>
              }

              <div class="space-y-4">
                <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-blue border border-[#eae6dd]">
                  <svg class="icon icon-md text-primary-blue" aria-hidden="true">
                    <use [attr.href]="'#' + getPackageIconId(pkg.id)"/>
                  </svg>
                </div>
                <div class="space-y-1">
                  <h3 class="text-xl font-bold text-[#1f2b1d] uppercase tracking-tight">{{ pkg.name }}</h3>
                  <span class="block text-[10px] font-mono font-bold text-[#778575] uppercase tracking-wider">Fixed Kampala rate</span>
                </div>
                <p class="text-xs text-[#4d594b] leading-relaxed">
                  {{ pkg.description }}
                </p>
              </div>

              <!-- Price Box -->
              <div class="py-5 border-y border-[#eae6dd] space-y-2">
                <span class="text-[9px] uppercase font-bold text-[#778575] tracking-wider block font-mono">Investment Value:</span>
                <div class="flex items-baseline space-x-1.5">
                  <span class="text-2xl sm:text-3xl font-black text-[#1f2b1d] font-sans">
                    {{ formatUgx(pkg.price) }}
                  </span>
                  <span class="text-xs font-semibold text-accent-gold uppercase font-mono">UGX</span>
                </div>
                <div class="text-[10px] font-bold text-[#778575] flex items-center space-x-1.5 font-mono">
                  <svg class="icon icon-xs text-[#bf5d39]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>Delivery: {{ pkg.deliveryTime || '3-5 Days' }}</span>
                </div>
              </div>

              <!-- Features checklist details -->
              <div class="space-y-4">
                <span class="text-[9px] uppercase font-bold text-[#778575] tracking-widest block font-mono">Included deliverables:</span>
                <ul class="space-y-3.5 text-xs text-[#4d594b]">
                  @for (feat of pkg.features; track $index) {
                    <li class="flex items-start space-x-2.5">
                      <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0"><use href="#icon-check"/></svg>
                      <span class="text-slate-650">{{ feat }}</span>
                    </li>
                  }
                </ul>
              </div>

              <!-- Package Highlights conditional block -->
              @if (pkg.id === 'starter') {
                <div class="p-3.5 bg-white border border-[#eae6dd] rounded-xl text-xs text-[#778575] italic">
                  <span class="font-bold text-[#1f2b1d] block mb-0.5 not-italic uppercase tracking-wider text-[10px]">Need changes?</span>
                  Just message Bilal. I will handle minor updates or content updates for you quickly and reliably.
                </div>
              } @else if (pkg.id === 'business') {
                <div class="p-3.5 bg-emerald-50/40 border border-[#eae6dd] rounded-xl text-xs text-[#778575]">
                  <span class="font-bold text-[#1f2b1d] block mb-0.5 uppercase tracking-wider text-[10px]">Self Management:</span>
                  You get an intuitive admin dashboard to update elements, texts, and gallery images instantly anytime from your phone.
                </div>
              } @else if (pkg.id === 'ecommerce') {
                <div class="p-3.5 bg-[#eae6dd]/40 border border-[#eae6dd] rounded-xl text-xs text-[#778575] flex flex-col">
                  <span class="font-bold text-accent-gold block mb-0.5 uppercase tracking-wider text-[10px]">E-Commerce Engine:</span>
                  <span>Full control over checkouts. Instantly manage products, change prices, and review customer bookings right from your phone.</span>
                </div>
              }
            </div>

            <!-- CTA Box flat style -->
            <div class="px-6 pb-8 pt-4">
              <a [routerLink]="['/contact']" [queryParams]="{ package: pkg.name }" class="btn-premium-primary text-[11px] tracking-wider uppercase text-center w-full shadow-xs cursor-pointer bg-primary-blue hover:bg-primary-blue-dark">
                Start Project Now
              </a>
            </div>
          </div>
        } @empty {
          <div class="col-span-3 py-12 text-center text-sm text-[#778575]">No service packages found. Add one in the Admin panel!</div>
        }
      </div>

      <!-- Admin Features Box - Switched to Natural Forest Green -->
      <div class="bg-[#4e6049] text-white rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden shadow-xl" id="admin-features-box">
        <!-- Accent ambient light shapes -->
        <div class="absolute -right-16 -top-16 w-48 h-48 bg-[#bf5d39]/10 rounded-full blur-2xl"></div>
        <div class="absolute -left-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

        <div class="space-y-4 max-w-3xl relative z-10 text-left">
          <div class="inline-flex items-center space-x-2 py-1 px-3 bg-[#bf5d39]/25 border border-[#bf5d39]/45 text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg">
            <span>Admin Option Pack</span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">Admin Dashboard: Included with Business & E-Commerce</h3>
          <p class="text-[#eae6dd] text-xs sm:text-sm leading-relaxed max-w-2xl">
            Forget about calling a developer for every tiny text change. From the Business Package upwards, every platform contains an extremely straightforward, secure admin panel configured exactly for local operations.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 text-[#faf8f4] text-left" id="admin-feature-capabilities">
          <div class="space-y-4 bg-black/15 p-5 sm:p-6 rounded-2xl border border-white/10">
            <span class="text-xs font-mono font-bold text-accent-gold uppercase tracking-wider">Content Management</span>
            <ul class="space-y-3.5 text-xs">
              <li class="flex items-start space-x-2.5">
                <span class="text-[#eae6dd]">•</span>
                <span>Edit copy lists and photos instantly</span>
              </li>
              <li class="flex items-start space-x-2.5">
                <span class="text-[#eae6dd]">•</span>
                <span>Update services, prices, and catalogs</span>
              </li>
              <li class="flex items-start space-x-2.5">
                <span class="text-[#eae6dd]">•</span>
                <span>Manage showcase photo portfolio</span>
              </li>
            </ul>
          </div>

          <div class="space-y-4 bg-black/15 p-5 sm:p-6 rounded-2xl border border-white/10">
            <span class="text-xs font-mono font-bold text-accent-gold uppercase tracking-wider">Interactivity</span>
            <ul class="space-y-3.5 text-xs">
              <li class="flex items-start space-x-2.5">
                <span class="text-[#eae6dd]">•</span>
                <span>Post dynamic news and alerts</span>
              </li>
              <li class="flex items-start space-x-2.5">
                <span class="text-[#eae6dd]">•</span>
                <span>View customer messages / inquiries</span>
              </li>
              <li class="flex items-start space-x-2.5">
                <span class="text-[#eae6dd]">•</span>
                <span>Fully mobile optimized dashboard</span>
              </li>
            </ul>
          </div>

          <div class="space-y-4 bg-black/15 p-5 sm:p-6 rounded-2xl border border-white/10 sm:col-span-2 lg:col-span-1">
            <span class="text-xs font-mono font-bold text-accent-gold uppercase tracking-wider">E-Commerce Exclusives</span>
            <ul class="space-y-3.5 text-xs">
              <li class="flex items-start space-x-2.5">
                <span class="text-[#eae6dd]">•</span>
                <span>Manage products and stock (E-Commerce)</span>
              </li>
              <li class="flex items-start space-x-2.5">
                <span class="text-[#eae6dd]">•</span>
                <span>Review bookings and orders (E-Commerce)</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 text-left">
          <p class="text-xs text-[#eae6dd] font-medium font-mono font-bold uppercase tracking-wide">
            "NO COMPLEX CODING. UPDATE YOUR SITE IN SECONDS FROM ANY MOBILE SCREEN."
          </p>
          <p class="text-[11.5px] text-[#eae6dd] italic max-w-md text-left sm:text-right font-normal leading-relaxed">
            <strong>Starter Package Note:</strong> On the Starter plan, Bilal manages technical updates for you directly. Have a tweak? Just send a message and minor adjustments will be handled free of charge.
          </p>
        </div>
      </div>

      <!-- Custom footer query below cards -->
      <div class="text-left pt-2 max-w-xl border-l-2 border-[#eae6dd] pl-6 animate-fade-in" id="custom-packages-footer">
        <p class="text-[#778575] text-xs leading-relaxed italic">
          Need custom specifications or looking for a fast-track checkout approach?
          <a [href]="whatsappLink()" target="_blank" rel="noopener noreferrer" class="font-bold text-primary-blue hover:underline">
            Consult Bilal directly on WhatsApp
          </a> 
          as I build bespoke web architectures matching Uganda's fast growing local business community.
        </p>
      </div>

      <!-- PREMIUM INTERACTIVE WEBSITE COST CALCULATOR (UI/UX PRO MAX) -->
      <div class="bg-gradient-to-br from-[#faf8f4] to-[#f5f1e6] border border-[#eae6dd] rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm text-left" id="interactive-calculator-section">
        <div class="space-y-3">
          <div class="inline-flex items-center space-x-2 py-1 px-3 bg-[#bf5d39]/10 border border-[#bf5d39]/30 text-[#bf5d39] text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg">
            <span>Dynamic Cost Tool</span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1f2b1d] uppercase">Kampala Web Design Cost Estimator</h3>
          <p class="text-xs sm:text-sm text-[#778575] leading-relaxed max-w-2xl">
            Configure your bespoke website features, page scope, and timeline speeds below. Watch your investment quote update in real-time, matching transparent Kampala freelance rates with zero markups.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Configurations Panel (Left Column) -->
          <div class="lg:col-span-7 space-y-6">
            <!-- 1. Select Base Plan -->
            <div class="space-y-3">
              <span class="block text-xs font-mono font-bold uppercase text-[#778575] tracking-widest">1. Select Your Base Plan</span>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button 
                  type="button"
                  (click)="setPackage('starter')"
                  class="flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer text-xs"
                  [class.bg-[#1f2b1d]]="selectedPackageId() === 'starter'"
                  [class.text-white]="selectedPackageId() === 'starter'"
                  [class.border-[#1f2b1d]]="selectedPackageId() === 'starter'"
                  [class.bg-white]="selectedPackageId() !== 'starter'"
                  [class.text-[#1f2b1d]]="selectedPackageId() !== 'starter'"
                  [class.border-[#eae6dd]]="selectedPackageId() !== 'starter'"
                  [class.hover:border-[#bf5d39]/50]="selectedPackageId() !== 'starter'"
                >
                  <span class="font-bold tracking-tight text-sm">Starter</span>
                  <span class="text-[10px] font-mono mt-0.5" [class.text-amber-400]="selectedPackageId() === 'starter'" [class.text-accent-gold]="selectedPackageId() !== 'starter'">UGX 500K</span>
                  <span class="text-[10px] mt-2 block opacity-80">Up to 3 high-speed landing pages</span>
                </button>

                <button 
                  type="button"
                  (click)="setPackage('business')"
                  class="flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer text-xs"
                  [class.bg-[#1f2b1d]]="selectedPackageId() === 'business'"
                  [class.text-white]="selectedPackageId() === 'business'"
                  [class.border-[#1f2b1d]]="selectedPackageId() === 'business'"
                  [class.bg-white]="selectedPackageId() !== 'business'"
                  [class.text-[#1f2b1d]]="selectedPackageId() !== 'business'"
                  [class.border-[#eae6dd]]="selectedPackageId() !== 'business'"
                  [class.hover:border-[#bf5d39]/50]="selectedPackageId() !== 'business'"
                >
                  <span class="font-bold tracking-tight text-sm">Business</span>
                  <span class="text-[10px] font-mono mt-0.5" [class.text-amber-400]="selectedPackageId() === 'business'" [class.text-accent-gold]="selectedPackageId() !== 'business'">UGX 1.0M</span>
                  <span class="text-[10px] mt-2 block opacity-80">Up to 7 pages & customized Admin Panel</span>
                </button>

                <button 
                  type="button"
                  (click)="setPackage('ecommerce')"
                  class="flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer text-xs"
                  [class.bg-[#1f2b1d]]="selectedPackageId() === 'ecommerce'"
                  [class.text-white]="selectedPackageId() === 'ecommerce'"
                  [class.border-[#1f2b1d]]="selectedPackageId() === 'ecommerce'"
                  [class.bg-white]="selectedPackageId() !== 'ecommerce'"
                  [class.text-[#1f2b1d]]="selectedPackageId() !== 'ecommerce'"
                  [class.border-[#eae6dd]]="selectedPackageId() !== 'ecommerce'"
                  [class.hover:border-[#bf5d39]/50]="selectedPackageId() !== 'ecommerce'"
                >
                  <span class="font-bold tracking-tight text-sm">E-Commerce</span>
                  <span class="text-[10px] font-mono mt-0.5" [class.text-amber-400]="selectedPackageId() === 'ecommerce'" [class.text-accent-gold]="selectedPackageId() !== 'ecommerce'">UGX 1.8M</span>
                  <span class="text-[10px] mt-2 block opacity-80">Up to 15 pages & checkout payments</span>
                </button>
              </div>
            </div>

            <!-- 2. Customize Page Scope -->
            <div class="space-y-3 bg-white p-5 rounded-2xl border border-[#eae6dd]">
              <div class="flex items-center justify-between">
                <div>
                  <span class="block text-xs font-mono font-bold uppercase text-[#778575] tracking-widest">2. Scope: Number of Web Pages</span>
                  <p class="text-[11px] text-[#778575] mt-0.5">Base Plan includes <strong class="text-[#1f2b1d]">{{ includedPages() }}</strong> pages. Add extra pages at wholesale rate.</p>
                </div>
                <div class="flex items-center space-x-3 bg-[#faf8f4] px-3 py-1.5 rounded-xl border border-[#eae6dd]">
                  <button 
                    type="button"
                    (click)="adjustPages(-1)"
                    class="w-8 h-8 rounded-lg bg-white border border-[#eae6dd] flex items-center justify-center hover:bg-[#eae6dd] text-lg font-bold text-[#1f2b1d] transition-all disabled:opacity-40"
                    [disabled]="customPages() <= includedPages()"
                  >
                    -
                  </button>
                  <span class="text-sm font-extrabold text-[#1f2b1d] w-6 text-center font-mono">{{ customPages() }}</span>
                  <button 
                    type="button"
                    (click)="adjustPages(1)"
                    class="w-8 h-8 rounded-lg bg-white border border-[#eae6dd] flex items-center justify-center hover:bg-[#eae6dd] text-lg font-bold text-[#1f2b1d] transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
              @if (extraPages() > 0) {
                <div class="pt-2 flex justify-between items-center border-t border-[#eae6dd]/60 text-[11px]">
                  <span class="text-[#778575]">Extra Pages Added:</span>
                  <span class="font-mono font-bold text-accent-gold">+{{ extraPages() }} Pages (+UGX {{ formatUgx(extraPagesCost()) }})</span>
                </div>
              }
            </div>

            <!-- 3. Dynamic Premium Add-ons -->
            <div class="space-y-3">
              <span class="block text-xs font-mono font-bold uppercase text-[#778575] tracking-widest">3. Premium Operational Add-ons</span>
              <div class="space-y-2.5">
                <!-- Advanced local SEO -->
                <button 
                  type="button" 
                  (click)="toggleSeo()"
                  class="w-full flex items-center justify-between p-4 bg-white hover:bg-[#fcfaf6] border rounded-2xl transition-all cursor-pointer text-left"
                  [class.border-l-4]="advancedSeo()"
                  [class.border-l-accent-gold]="advancedSeo()"
                  [class.border-[#eae6dd]]="!advancedSeo()"
                >
                  <div class="flex items-start space-x-3 pr-2">
                    <span class="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">S</span>
                    <div>
                      <h4 class="text-xs font-bold text-[#1f2b1d] uppercase tracking-wide">Advanced Local SEO (Kampala Keywords Optimization)</h4>
                      <p class="text-[10px] text-[#778575] mt-0.5 leading-relaxed">Boost ranking on queries like "web design near me" and dynamic regional indexing setup.</p>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="block text-[11px] font-mono font-bold text-[#1f2b1d]">+UGX 200,000</span>
                    <span class="text-[9px] uppercase font-bold tracking-widest block font-mono mt-0.5" [class.text-emerald-600]="advancedSeo()" [class.text-slate-400]="!advancedSeo()">
                      {{ advancedSeo() ? '✓ Added' : 'Add' }}
                    </span>
                  </div>
                </button>

                <!-- Express Timeline -->
                <button 
                  type="button" 
                  (click)="toggleExpress()"
                  class="w-full flex items-center justify-between p-4 bg-white hover:bg-[#fcfaf6] border rounded-2xl transition-all cursor-pointer text-left"
                  [class.border-l-4]="expressDelivery()"
                  [class.border-l-accent-gold]="expressDelivery()"
                  [class.border-[#eae6dd]]="!expressDelivery()"
                >
                  <div class="flex items-start space-x-3 pr-2">
                    <span class="w-5 h-5 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">⚡</span>
                    <div>
                      <h4 class="text-xs font-bold text-[#1f2b1d] uppercase tracking-wide">Super Express Delivery Mode (Launch in 48 Hours)</h4>
                      <p class="text-[10px] text-[#778575] mt-0.5 leading-relaxed">Prioritizes your design on the pipeline with dedicated 24h design sprints.</p>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="block text-[11px] font-mono font-bold text-[#1f2b1d]">+UGX 150,000</span>
                    <span class="text-[9px] uppercase font-bold tracking-widest block font-mono mt-0.5" [class.text-emerald-600]="expressDelivery()" [class.text-slate-400]="!expressDelivery()">
                      {{ expressDelivery() ? '✓ Added' : 'Add' }}
                    </span>
                  </div>
                </button>

                <!-- Google Analytics setup -->
                <button 
                  type="button" 
                  (click)="toggleAnalytics()"
                  class="w-full flex items-center justify-between p-4 bg-white hover:bg-[#fcfaf6] border rounded-2xl transition-all cursor-pointer text-left"
                  [class.border-l-4]="analyticsSetup()"
                  [class.border-l-accent-gold]="analyticsSetup()"
                  [class.border-[#eae6dd]]="!analyticsSetup()"
                >
                  <div class="flex items-start space-x-3 pr-2">
                    <span class="w-5 h-5 rounded-md bg-[#bf5d39]/10 text-accent-gold flex items-center justify-center text-xs font-black shrink-0 mt-0.5">G</span>
                    <div>
                      <h4 class="text-xs font-bold text-[#1f2b1d] uppercase tracking-wide">Google Search Console & Live Analytics Setup</h4>
                      <p class="text-[10px] text-[#778575] mt-0.5 leading-relaxed">Review user location click channels, daily traffic counts, and mobile behavior live.</p>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="block text-[11px] font-mono font-bold text-[#1f2b1d]">+UGX 100,000</span>
                    <span class="text-[9px] uppercase font-bold tracking-widest block font-mono mt-0.5" [class.text-emerald-600]="analyticsSetup()" [class.text-slate-400]="!analyticsSetup()">
                      {{ analyticsSetup() ? '✓ Added' : 'Add' }}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Total Receipt / Summary Invoice (Right Column) -->
          <div class="lg:col-span-5 bg-[#1f2b1d] text-[#faf8f4] rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-lg border border-white/5">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 -translate-y-12"></div>
            
            <div class="space-y-1 text-left">
              <span class="text-[9px] font-mono tracking-widest uppercase text-accent-gold">Kampala Spec Invoice</span>
              <h4 class="text-lg font-black uppercase text-white tracking-tight">Project Quick Quote</h4>
            </div>

            <!-- Receipt Items Breakdown -->
            <div class="space-y-4 text-xs pt-4 border-t border-white/10 text-neutral-300">
              <div class="flex justify-between">
                <span>Base Plan:</span>
                <span class="font-mono text-white text-right">UGX {{ formatUgx(basePrice()) }}</span>
              </div>
              
              <div class="flex justify-between">
                <span>Included Pages ({{ includedPages() }}):</span>
                <span class="font-mono text-emerald-400 text-right">Included Free</span>
              </div>

              @if (extraPages() > 0) {
                <div class="flex justify-between text-neutral-300">
                  <span>Extra Pages (x{{ extraPages() }}):</span>
                  <span class="font-mono text-white text-right">UGX {{ formatUgx(extraPagesCost()) }}</span>
                </div>
              }

              @if (advancedSeo()) {
                <div class="flex justify-between">
                  <span>Advanced Local SEO Pack:</span>
                  <span class="font-mono text-white text-right">UGX 200,000</span>
                </div>
              }

              @if (expressDelivery()) {
                <div class="flex justify-between">
                  <span>⚡ Express Pipeline Addon:</span>
                  <span class="font-mono text-white text-right">UGX 150,000</span>
                </div>
              }

              @if (analyticsSetup()) {
                <div class="flex justify-between">
                  <span>Google Analytics Integration:</span>
                  <span class="font-mono text-white text-right">UGX 100,000</span>
                </div>
              }

              <div class="flex justify-between text-neutral-300">
                <span>Domain + Security Hosting:</span>
                <span class="font-mono text-emerald-400 text-right">1st Year Free</span>
              </div>

              <div class="flex justify-between border-t border-white/10 pt-4">
                <span class="font-bold text-white uppercase tracking-wider">Estimated Timeline:</span>
                <span class="font-semibold text-accent-gold text-right">{{ estimatedTime() }}</span>
              </div>
            </div>

            <!-- Live Total Investment Sum -->
            <div class="p-4 bg-black/30 rounded-xl space-y-1 text-left">
              <span class="text-[9px] font-mono tracking-wider text-slate-400 uppercase block">Total Estimated Value:</span>
              <div class="flex items-baseline space-x-1.5 justify-start">
                <span class="text-2xl sm:text-3xl font-black text-white font-sans">
                  UGX {{ formatUgx(totalEstimatedCost()) }}
                </span>
                <span class="text-[10px] font-bold text-accent-gold font-mono">NET-VAT CLEAR</span>
              </div>
            </div>

            <!-- Order Trigger Directly Connected with Calculated message -->
            <div class="space-y-3">
              <a 
                [href]="calculatorWhatsAppUrl()" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="w-full flex items-center justify-center space-x-2.5 py-4 bg-[#25d366] hover:bg-[#20ba5a] text-white font-extrabold uppercase tracking-widest text-[11px] rounded-xl transition-all shadow-lg active:scale-95 duration-150 cursor-pointer"
              >
                <svg class="w-5 h-5 fill-current text-white"><use href="#icon-whatsapp"/></svg>
                <span>Submit & Discuss on WhatsApp</span>
              </a>
              <div class="flex items-center justify-center space-x-2 text-[10px] text-zinc-400">
                <span class="relative flex h-2 w-2 shrink-0">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="font-mono">Live Booking Queue: Active Online in Kampala</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Included Box with beautiful borders -->
      <div class="bg-[#faf8f4] border border-[#eae6dd] rounded-2xl p-6 sm:p-10 space-y-6" id="service-benefit-box">
        <div class="flex items-center space-x-3 text-slate-900 border-b border-[#eae6dd] pb-4 text-left">
          <svg class="icon text-primary-blue" style="width: 28px; height: 28px;"><use href="#icon-package"/></svg>
          <h4 class="text-xl font-extrabold tracking-tight text-[#1f2b1d] uppercase">Standard in EVERY single Package</h4>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-[#4d594b] text-left" id="benefit-list">
          <div class="flex items-start space-x-2.5">
            <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0"><use href="#icon-check"/></svg>
            <span class="text-slate-650"><strong>Free .online / .com Domain</strong> configuration (1st Year)</span>
          </div>
          <div class="flex items-start space-x-2.5">
            <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0"><use href="#icon-check"/></svg>
            <span class="text-slate-650"><strong>Free Secure Hosting</strong> setup (1st Year)</span>
          </div>
          <div class="flex items-start space-x-2.5">
            <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0"><use href="#icon-check"/></svg>
            <span class="text-slate-650"><strong>Responsive UI</strong> responsive and fluid on phones</span>
          </div>
          <div class="flex items-start space-x-2.5">
            <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0"><use href="#icon-check"/></svg>
            <span class="text-slate-650"><strong>Basic Google Schema SEO Maps</strong> registry orientation</span>
          </div>
          <div class="flex items-start space-x-2.5">
            <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0"><use href="#icon-check"/></svg>
            <span class="text-slate-650"><strong>Transparent Billing</strong>: Fixed prices completely clear of markups</span>
          </div>
          <div class="flex items-start space-x-2.5">
            <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0"><use href="#icon-check"/></svg>
            <span class="text-slate-650"><strong>Direct WhatsApp Channels</strong> configured properly</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class ServicesComponent {
  dataState = inject(DataState);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  // Dynamic cost configuration signals
  selectedPackageId = signal<string>('business');
  customPages = signal<number>(7);
  expressDelivery = signal<boolean>(false);
  advancedSeo = signal<boolean>(false);
  analyticsSetup = signal<boolean>(false);

  constructor() {
    this.titleService.setTitle('Web Design Packages & Pricing Kampala Uganda near me - Bilal Web');
    this.metaService.updateTag({ name: 'description', content: 'Explore top-rated website design packages near me in Kampala, Uganda starting from UGX 500,000. Free domain, web hosting, local SEO configuration and WhatsApp integration included.' });
    this.metaService.updateTag({ name: 'keywords', content: 'web design pricing Kampala, website cost Uganda, affordable web design Kampala, website developer near me, cheap web design Uganda, website design prices Kampala, e-commerce cost Kampala, best website developers Uganda' });

    afterNextRender(() => {
      const initAnimation = () => {
        const cards = document.querySelectorAll('.service-card');
        if (cards.length === 0) {
          setTimeout(initAnimation, 100);
          return;
        }
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(
                entry.target,
                { opacity: [0, 1], y: [42, 0] },
                { duration: 0.8, ease: "easeOut" }
              );
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px'
        });
        cards.forEach(card => observer.observe(card));
      };
      initAnimation();
    });
  }

  // Set package and adjust page totals automatically based on default limits
  setPackage(id: string) {
    this.selectedPackageId.set(id);
    this.customPages.set(this.includedPages());
  }

  adjustPages(val: number) {
    const next = this.customPages() + val;
    const minPages = this.includedPages();
    if (next >= minPages) {
      this.customPages.set(next);
    }
  }

  toggleSeo() {
    this.advancedSeo.update(v => !v);
  }

  toggleExpress() {
    this.expressDelivery.update(v => !v);
  }

  toggleAnalytics() {
    this.analyticsSetup.update(v => !v);
  }

  basePrice = computed(() => {
    const id = this.selectedPackageId();
    if (id === 'starter') return 500000;
    if (id === 'ecommerce') return 1800000;
    return 1000000; // business
  });

  includedPages = computed(() => {
    const id = this.selectedPackageId();
    if (id === 'starter') return 3;
    if (id === 'ecommerce') return 15;
    return 7; // business
  });

  extraPages = computed(() => {
    return Math.max(0, this.customPages() - this.includedPages());
  });

  extraPagesCost = computed(() => {
    const id = this.selectedPackageId();
    const rate = id === 'starter' ? 50000 : (id === 'ecommerce' ? 40000 : 45000);
    return this.extraPages() * rate;
  });

  expressCost = computed(() => {
    return this.expressDelivery() ? 150000 : 0;
  });

  seoCost = computed(() => {
    return this.advancedSeo() ? 200000 : 0;
  });

  analyticsCost = computed(() => {
    return this.analyticsSetup() ? 100000 : 0;
  });

  totalEstimatedCost = computed(() => {
    return this.basePrice() + this.extraPagesCost() + this.expressCost() + this.seoCost() + this.analyticsCost();
  });

  estimatedTime = computed(() => {
    const baseDays = this.selectedPackageId() === 'starter' ? '3-5' : (this.selectedPackageId() === 'ecommerce' ? '12-15' : '7-10');
    if (this.expressDelivery()) {
      return '2-3 Days (Express sprint)';
    }
    return `${baseDays} Days`;
  });

  whatsappLink = computed(() => {
    const raw = this.dataState.whatsappNumber();
    const clean = raw.replace(/\+/g, '').replace(/[^0-9]/g, '');
    return `https://wa.me/${clean}`;
  });

  calculatorWhatsAppUrl = computed(() => {
    const rawNum = this.dataState.whatsappNumber();
    const cleanNum = rawNum.replace(/\+/g, '').replace(/[^0-9]/g, '');
    const pkgName = this.selectedPackageId() === 'starter' ? 'Starter Plan' : (this.selectedPackageId() === 'ecommerce' ? 'E-Commerce Suite' : 'Business Showcase');
    const pageDetails = this.extraPages() > 0 ? ` + ${this.extraPages()} extra pages` : '';
    const addons = [
      this.expressDelivery() ? 'Express 48h Delivery' : '',
      this.advancedSeo() ? 'Advanced Local SEO' : '',
      this.analyticsSetup() ? 'Google Analytics Tracking' : ''
    ].filter(Boolean).join(', ');
    const addonsStr = addons ? ` with Add-ons (${addons})` : '';
    const text = `Hi Bilal! I used the Premium Interactive Cost Estimator on your website. I want to build a ${pkgName}${pageDetails}${addonsStr}. Estimated Price: UGX ${this.formatUgx(this.totalEstimatedCost())}. Let's discuss starting our project!`;
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
  });

  formatUgx(amount: string | number): string {
    const parsed = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(parsed)) return String(amount);
    return new Intl.NumberFormat('en-US').format(parsed);
  }

  getPackageIconId(id: string): string {
    const map: Record<string, string> = {
      'starter': 'icon-page',
      'business': 'icon-building',
      'ecommerce': 'icon-cart',
      'premium-3d': 'icon-wrench',
      'one-page': 'icon-page',
      'redesign': 'icon-refresh',
      'maintenance': 'icon-wrench'
    };
    return map[id] || 'icon-info';
  }
}
