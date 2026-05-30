import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <section class="space-y-16 py-12 animate-slide-up text-left">
      
      <!-- Headline & Photo Mock Section with beautiful Terracotta and Clay overlays -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#4e6049] text-[#faf8f4] p-8 sm:p-12 lg:p-16 rounded-3xl shadow-xl relative overflow-hidden">
        <!-- Accent circles -->
        <div class="absolute -right-16 -top-16 w-48 h-48 bg-[#bf5d39]/10 rounded-full blur-2xl"></div>
        <div class="absolute -left-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

        <div class="lg:col-span-12 space-y-6 text-left relative z-10">
          <div class="inline-flex items-center space-x-2 py-1 px-3 bg-accent-gold/25 border border-accent-gold/45 text-[#fcfaf6] text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse"></span>
            <span>Kampala Elite Developer</span>
          </div>
          
          <div class="space-y-2">
            <span class="block text-accent-gold text-xs font-mono tracking-widest uppercase">MEET THE DEVELOPER</span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight uppercase tracking-tight" id="about-title">
              THE FACE BEHIND BILAL WEB
            </h1>
          </div>
          
          <div class="text-slate-100 text-sm sm:text-base space-y-5 leading-relaxed max-w-4xl font-normal" id="about-content">
            <p>
              Hi, I’m <strong class="text-white text-base">Bilal Ahmed</strong>, a freelance web developer based in Kampala. I craft high-speed, mobile-responsive, and gorgeous websites tailored specifically to help local brands and small physical businesses look premium online. I started building websites because I saw too many outstanding Ugandan businesses with slow, expensive setups or bloated templates that failed to load on budget mobile networks.
            </p>
            <p>
              By using highly optimized, handwritten styling and clean architecture, I ensure your visitors get an instant, delightful response in milliseconds, even on fluctuating cellular data profiles.
            </p>
            <p>
              For Business and E-Commerce clients, I integrate an easy-to-use custom backend database so that you have total control of your website's elements, with no designer needed for everyday updates.
            </p>
            <p>
              When I'm not coding or tuning responsiveness ratios, I'm probably studying user behavior indices or learning new backend performance protocols. Let's partner and design a genuine, elegant web layout that generates real credibility and profit for your business.
            </p>
          </div>
          
          <!-- Skill Badges in beautiful warm clay outlines -->
          <div class="flex flex-wrap gap-2.5 pt-4 border-t border-white/10" id="about-skills-badges">
            <span class="bg-white/5 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-white/10">HTML/CSS Mastery</span>
            <span class="bg-white/5 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-white/10">Angular Server SSR</span>
            <span class="bg-white/5 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-white/10">Speed Optimization</span>
            <span class="bg-white/5 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-white/10">MoMo Payment Rails</span>
            <span class="bg-white/5 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-white/10">Local Kampala SEO</span>
          </div>
        </div>
      </div>

      <!-- Detail cards section: Quality standards and developmental principles -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        
        <!-- Standards -->
        <div class="p-8 bg-[#fcfaf6] border border-[#eae6dd] rounded-2xl space-y-5 hover:border-[#bf5d39]/30 transition-all shadow-xs">
          <div class="w-10 h-10 rounded-full bg-[#fdfaf2] flex items-center justify-center border border-[#ece3ca] text-accent-gold">
            <svg class="icon icon-sm text-accent-gold" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 class="text-xl font-bold text-[#1f2b1d] uppercase tracking-tight">My Core Work Standards</h3>
          <p class="text-xs sm:text-sm text-[#778575] leading-relaxed">
            I don't just paste heavy templates. I make sure every webpage operates under strict quality guidelines:
          </p>
          <ul class="space-y-4 text-xs sm:text-sm pt-2">
            <li class="flex items-start space-x-2.5">
              <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0 animate-pulse"><use href="#icon-check"/></svg>
              <span class="text-[#4d594b]"><strong class="text-[#1f2b1d]">Lightweight Assets:</strong> Keeping files extremely light, so visitors on limited data packages load maps or shops instantly.</span>
            </li>
            <li class="flex items-start space-x-2.5">
              <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0"><use href="#icon-check"/></svg>
              <span class="text-[#4d594b]"><strong class="text-[#1f2b1d]">Responsive Canvas Layouts:</strong> No broken columns or horizontal scrollbars. Design adapts fluidly of cellular device scales.</span>
            </li>
            <li class="flex items-start space-x-2.5">
              <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0"><use href="#icon-check"/></svg>
              <span class="text-[#4d594b]"><strong class="text-[#1f2b1d]">Direct Touch Targets:</strong> All buttons, options, and input rows utilize a minimum 48px touch height boundary for thumbs.</span>
            </li>
          </ul>
        </div>

        <!-- Working style -->
        <div class="p-8 bg-[#fcfaf6] border border-[#eae6dd] rounded-2xl space-y-5 hover:border-[#bf5d39]/30 transition-all shadow-xs">
          <div class="w-10 h-10 rounded-full bg-[#fdfaf2] flex items-center justify-center border border-[#ece3ca] text-accent-gold">
            <svg class="icon icon-sm text-accent-gold" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h3 class="text-xl font-bold text-[#1f2b1d] uppercase tracking-tight">Efficient Digital Architecture</h3>
          <p class="text-xs sm:text-sm text-[#778575] leading-relaxed">
            By using modern, fast native frameworks combined with custom responsive layouts:
          </p>
          <ul class="space-y-4 text-xs sm:text-sm pt-2">
            <li class="flex items-start space-x-2.5">
              <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0"><use href="#icon-lightning"/></svg>
              <span class="text-[#4d594b]"><strong class="text-[#1f2b1d]">Fast Launch Timelines:</strong> Initial responsive interactive draft ready to review in 3 working days.</span>
            </li>
            <li class="flex items-start space-x-2.5">
              <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0"><use href="#icon-lightning"/></svg>
              <span class="text-[#4d594b]"><strong class="text-[#1f2b1d]">Kampala Localized SEO:</strong> Configured metadata properties optimized for local searches like "web design in Kokolo" or "near me".</span>
            </li>
            <li class="flex items-start space-x-2.5">
              <svg class="icon icon-sm text-[#bf5d39] mt-0.5 flex-shrink-0"><use href="#icon-lightning"/></svg>
              <span class="text-[#4d594b]"><strong class="text-[#1f2b1d]">Transparent Pricing Models:</strong> Flat budget packages with zero surprise licensing fees or expensive developer retainer loops.</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- Quality pledge block with earthy terracotta decoration -->
      <div class="border border-[#eae6dd] bg-white rounded-3xl p-8 sm:p-12 text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-sm" id="about-pledge-cta">
        <div class="absolute top-0 right-0 w-32 h-32 bg-[#faf8f4] rounded-full translate-x-16 -translate-y-16"></div>
        <div class="lg:col-span-8 space-y-4 z-10 text-left">
          <span class="small-label text-accent-gold">My Guarantee</span>
          <h3 class="text-2xl sm:text-3xl font-extrabold text-[#1f2b1d] uppercase tracking-tight">I Stand Behind Every Single Line of Code</h3>
          <p class="text-xs sm:text-sm text-[#778575] max-w-xl">
            A website should be an investment that lasts for years. I guarantee optimized, robust performance, clean file configurations, and straightforward guides so you always completely own and control your digital storefront.
          </p>
        </div>
        <div class="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end z-10 w-full">
          <a routerLink="/portfolio" class="bg-primary-blue hover:bg-primary-blue-dark text-white font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-xl shadow-md text-center w-full transition-transform hover:-translate-y-0.5 duration-150 cursor-pointer">
            View Case Studies
          </a>
          <a routerLink="/contact" class="bg-transparent hover:bg-[#bf5d39]/5 text-[#bf5d39] border border-[#bf5d39] font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-xl text-center w-full transition-all duration-150 cursor-pointer">
            Let's Discuss Project
          </a>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class AboutComponent {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  constructor() {
    this.titleService.setTitle('About Bilal Web | Website Developer near me Kampala Uganda');
    this.metaService.updateTag({ name: 'description', content: 'Learn about Bilal Ahmed, professional freelance website designer near me in Kampala, Uganda. Delivering high-speed mobile-tailored storefronts with WhatsApp integration.' });
    this.metaService.updateTag({ name: 'keywords', content: 'about Bilal Web, web designer near me, website developer near Kampala, freelance website builder Uganda, local website design near me, regional website designer Uganda' });
  }
}
