import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DataState } from '../services/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-portfolio',
  imports: [],
  template: `
    <section class="space-y-12 py-12 animate-slide-up text-left">
      <!-- High-End Editorial Introduction -->
      <div class="space-y-4 max-w-3xl animate-fade-in">
        <div class="small-label text-accent-gold">My Handcrafted Work</div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1f2b1d] uppercase tracking-tight" id="portfolio-title">
          My Work Showcase
        </h1>
        <p class="text-xs sm:text-sm text-[#778575] leading-relaxed max-w-2xl" id="portfolio-intro">
          Real production-ready digital storefronts built with strict code hygiene. Click any showcase case below to view the active platform.
        </p>
      </div>

      <!-- Core Portfolio Cards Grid: 3 columns on desktop, 1 on mobile -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4" id="portfolio-cards-grid">
        @for (project of visibleProjects(); track project.id) {
          <a 
            [href]="project.demoUrl" 
            target="_blank"
            class="bg-[#fcfaf6] border border-[#eae6dd] rounded-2xl flex flex-col overflow-hidden text-left relative transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-4px_rgba(31,43,29,0.08)] hover:border-[#bf5d39]/50 group cursor-pointer no-underline"
            [id]="'portfolio-' + project.id"
          >
            <!-- Website Image / Poster Mockup -->
            <div class="w-full aspect-[16/10] bg-[#faf8f4] relative overflow-hidden flex items-center justify-center border-b border-[#eae6dd]">
              @if (project.image) {
                <img 
                  [src]="project.image" 
                  [attr.alt]="'Screenshot of ' + project.name + ' website'"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerpolicy="no-referrer"
                />
              } @else {
                <!-- Custom Vector Blueprint Previews -->
                <div class="absolute inset-0 bg-[#fbfaf6] flex items-center justify-center p-6 overflow-hidden select-none">
                  <div class="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#bf5d39_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none"></div>

                  @switch (project.id) {
                    @case ('furniture-3d') {
                      <div class="relative w-full h-full flex flex-col items-center justify-center text-center space-y-3">
                        <div class="absolute top-2 left-4 font-mono text-[8px] text-[#bf5d39] uppercase tracking-wider font-bold">Viewport / customizer / interactive</div>
                        <div class="relative w-28 h-28 transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-700 ease-out flex items-center justify-center">
                          <svg class="w-full h-full text-[#4e6049]/40" fill="none" viewBox="0 0 120 120" stroke="currentColor" stroke-width="1.2">
                            <rect x="30" y="55" width="60" height="15" rx="2" stroke-dasharray="3 2" />
                            <rect x="30" y="30" width="60" height="25" rx="2" />
                            <path d="M 22 25 L 22 95 M 98 25 L 98 95 M 22 58 L 98 58" stroke="#bf5d39" stroke-width="1.5" />
                            <circle cx="22" cy="35" r="2.5" fill="#eae6dd" stroke="#bf5d39" stroke-width="1" />
                            <circle cx="98" cy="35" r="2.5" fill="#eae6dd" stroke="#bf5d39" stroke-width="1" />
                            <path d="M 10 10 L 110 110 M 110 10 L 10 110" stroke="#778575" stroke-width="0.5" opacity="0.25" stroke-dasharray="4 4" />
                          </svg>
                        </div>
                        <div class="space-y-1">
                          <span class="text-[8px] sm:text-[9px] font-mono bg-[#bf5d39]/10 border border-[#bf5d39]/20 text-[#bf5d39] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                            3D Perspective Engine
                          </span>
                        </div>
                      </div>
                    }
                    @case ('coffee') {
                      <div class="relative w-full h-full flex flex-col items-center justify-center text-center space-y-3">
                        <div class="absolute top-2 left-4 font-mono text-[8px] text-[#bf5d39] uppercase tracking-wider font-bold">Bugolobi Heights / plot_49</div>
                        <div class="relative transform group-hover:scale-110 transition-transform duration-700 ease-out flex items-center justify-center w-16 h-16">
                          <div class="w-14 h-14 rounded-full bg-white border border-[#eae6dd]/80 shadow-xs flex items-center justify-center text-2xl">
                            ☕
                          </div>
                          <div class="absolute -top-3 flex space-x-1 justify-center animate-pulse opacity-50">
                            <span class="w-0.5 h-3 bg-[#bf5d39] rounded-full blur-[0.5px]"></span>
                            <span class="w-0.5 h-4 bg-[#bf5d39] rounded-full blur-[0.5px] delay-100"></span>
                            <span class="w-0.5 h-2.5 bg-[#bf5d39] rounded-full blur-[0.5px] delay-250"></span>
                          </div>
                        </div>
                        <div class="space-y-1">
                          <span class="text-[8px] sm:text-[9px] font-mono bg-emerald-50 border border-emerald-200 text-[#4e6049] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                            Bugisu arabica roast
                          </span>
                        </div>
                      </div>
                    }
                    @case ('barber') {
                      <div class="relative w-[92%] h-[92%] flex flex-col items-center justify-center text-center space-y-3 bg-[#0d120d] rounded-2xl border border-white/5 shadow-inner">
                        <div class="absolute top-2 left-4 font-mono text-[8px] text-[#bf5d39] uppercase tracking-wider font-bold">Kireka Stage / Shell Kampala</div>
                        <div class="relative transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-700 ease-out">
                          <div class="w-14 h-14 rounded-full bg-stone-900 border border-amber-500/20 flex items-center justify-center text-2xl shadow-lg">
                            💈
                          </div>
                          <div class="absolute -right-2 -bottom-1.5 bg-[#bf5d39] text-white text-[7px] font-mono font-black uppercase px-1 rounded border border-[#0d120d] tracking-widest">
                            VIP
                          </div>
                        </div>
                        <div class="space-y-0.5">
                          <span class="text-[8px] sm:text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                            Barbering Showcase
                          </span>
                        </div>
                      </div>
                    }
                    @case ('fashion') {
                      <div class="relative w-full h-full flex flex-col items-center justify-center text-center space-y-3">
                        <div class="absolute top-2 left-4 font-mono text-[8px] text-indigo-900 uppercase tracking-wider font-bold">Wandegeya / kitenge_wax_prints</div>
                        <div class="relative transform group-hover:scale-110 transition-transform duration-700 ease-out">
                          <div class="w-14 h-14 bg-white rounded-full border border-indigo-100 shadow-xs flex items-center justify-center text-2xl relative">
                            👗
                          </div>
                        </div>
                        <div class="space-y-1">
                          <span class="text-[8px] sm:text-[9px] font-mono bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                            Tailored Collections
                          </span>
                        </div>
                      </div>
                    }
                    @default {
                      <div class="flex flex-col items-center justify-center space-y-2 text-center p-4">
                        <svg class="w-8 h-8 text-[#bf5d39]/65 animate-pulse" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-.153-8.157-.418m16.314 0C19.645 11.754 18 13.91 16 15M12 10.5a15.485 15.485 0 00-7.843 4.582" />
                        </svg>
                        <span class="text-[10px] font-bold text-[#778575]/80 uppercase tracking-widest font-sans">Live Showcase Interactive Ready</span>
                      </div>
                    }
                  }
                </div>
              }
            </div>

            <!-- Footer Area: Only project name and View Site link -->
            <div class="p-5 flex items-center justify-between bg-white border-t border-[#eae6dd]/40 select-none">
              <span class="text-sm font-bold text-[#1f2b1d] uppercase tracking-tight truncate max-w-[65%]" [title]="project.name">
                {{ project.name }}
              </span>
              <span class="text-xs text-[#bf5d39] font-black inline-flex items-center gap-1 font-mono uppercase tracking-wider">
                <span>View Site</span>
                <span class="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
            </div>
          </a>
        } @empty {
          <div class="col-span-full py-16 text-center text-sm text-[#778575] bg-[#fcfaf6] border border-dashed border-[#eae6dd] rounded-2xl p-6">
            No active portfolio case studies yet.
          </div>
        }
      </div>
    </section>
  `,
  styles: []
})
export class PortfolioComponent {
  dataState = inject(DataState);

  private titleService = inject(Title);
  private metaService = inject(Meta);

  constructor() {
    this.titleService.setTitle('Web Design Portfolio Kampala | Real Projects & Case Studies | Bilal Web');
    this.metaService.updateTag({ name: 'description', content: 'Explore our professional website design work in Kampala, Uganda. High-speed, mobile-responsive websites built for local businesses. Contact Bilal Web to get started today.' });
    this.metaService.updateTag({ name: 'keywords', content: 'web design portfolio Kampala, website developer portfolio Uganda, Ugandan website design projects, business websites Kampala, mobile friendly sites Uganda, Bilal Web portfolio' });
  }

  visibleProjects = computed(() => this.dataState.projects().filter(p => p.visible !== false));
}
