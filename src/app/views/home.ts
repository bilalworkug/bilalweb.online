import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DataState } from '../services/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <!-- Top-level status ribbon -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-5 bg-primary-blue/5 border border-primary-blue/10 rounded-2xl animate-fade-in text-xs mb-8 animate-slide-up" id="home-status-ribbon">
      <div class="flex items-center space-x-2 text-primary-blue font-semibold">
        <span class="w-2 h-2 rounded-full bg-accent-gold animate-pulse flex-shrink-0"></span>
        <span>Available for local web development contracts in Kampala</span>
      </div>
      <div class="hidden sm:block text-slate-500 font-mono text-[10px]">
        Current Status: Booking Active
      </div>
    </div>

    <!-- Hero Banner Section - Interactive Digital Blueprint & Live Web-Craft Showcase -->
    <section id="hero-banner" class="relative overflow-hidden rounded-3xl text-white min-h-[580px] lg:min-h-[660px] p-6 sm:p-12 lg:p-16 flex items-center justify-center animate-fade-in shadow-2xl mb-12 bg-gradient-to-br from-[#0a1009] via-[#142313] to-[#050905] border border-[#5c7257]/25">
      <!-- 1. Ambient glowing orbital lights with gorgeous saturation -->
      <div class="absolute -top-16 -left-16 w-[450px] h-[450px] bg-[#bf5d39]/15 rounded-full filter blur-[110px] pointer-events-none mix-blend-screen"></div>
      <div class="absolute -bottom-24 -right-24 w-[550px] h-[550px] bg-[#5c7257]/25 rounded-full filter blur-[130px] pointer-events-none mix-blend-screen"></div>
      
      <!-- 2. Interactive SVG Blueprint Matrix Grid -->
      <svg class="absolute inset-0 w-full h-full opacity-[0.14] select-none pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="blueprint-grid-hero" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#eae6dd" stroke-width="0.75" />
            <path d="M 30 0 L 30 60 M 0 30 L 60 30" fill="none" stroke="#eae6dd" stroke-width="0.5" stroke-dasharray="2 2" />
            <circle cx="30" cy="30" r="1.25" fill="#fff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-grid-hero)" />
      </svg>

      <!-- 3. Dynamic Kampala Hills Elevation Topography Waves -->
      <svg class="absolute right-0 bottom-0 w-full h-full max-w-xl lg:max-w-2xl opacity-[0.15] select-none pointer-events-none text-accent-gold" viewBox="0 0 800 800" fill="none" stroke="currentColor">
        <path d="M 50 750 C 200 680, 250 500, 480 500 S 650 300, 800 200" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 100 780 C 280 690, 320 540, 560 520 S 720 320, 850 220" stroke-width="1.25" stroke-linecap="round" opacity="0.6" />
        <path d="M 10 700 C 150 630, 180 430, 400 450 S 580 250, 750 150" stroke-width="1.75" stroke-dasharray="8 4" stroke-linecap="round" opacity="0.8" />
        
        <!-- Regional nodes -->
        <circle cx="480" cy="500" r="6" fill="#bf5d39" />
        <circle cx="560" cy="520" r="4" fill="#5c7257" />
        <circle cx="400" cy="450" r="5" fill="#bf5d39" />
        <circle cx="750" cy="150" r="7" fill="#eae6dd" />
      </svg>

      <!-- Core Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full relative z-20 text-left">
        <!-- Left content column with modern display typography -->
        <div class="lg:col-span-6 space-y-6">
          <div class="inline-flex items-center space-x-2 py-1.5 px-3.5 bg-accent-gold/15 border border-accent-gold/30 text-accent-gold text-[10px] font-mono font-bold uppercase tracking-widest rounded-full" id="hero-chip">
            <span class="w-2 h-2 rounded-full bg-accent-gold animate-ping"></span>
            <span>Kampala Elite Web Engineering</span>
          </div>
          
          <div class="space-y-4">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#faf8f4] leading-[1.12] uppercase tracking-tight" id="hero-headline">
              Code as Art. <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-white font-black">High-Performance</span> <br />
              Web Systems.
            </h1>
          </div>
          
          <p class="text-xs sm:text-[14px] text-slate-300 leading-relaxed max-w-xl font-normal" id="hero-subheadline">
            Say goodbye to slow, bloated visual builders and high hosting fees. Bilal Web crafts pixel-perfect, tailored web solutions that load instantly, score 100% Core Vitals, and convert Ugandan audiences into customers.
          </p>

          <!-- Floating metrics banner -->
          <div class="grid grid-cols-3 gap-4 py-4 px-5 bg-white/5 border border-white/10 rounded-2xl max-w-lg select-none backdrop-blur-xs">
            <div class="text-left">
              <span class="block text-[10px] font-mono font-bold text-accent-gold uppercase tracking-wider">Speed Rate</span>
              <strong class="block text-lg font-black font-mono mt-0.5 text-[#faf8f4]">0.4s</strong>
            </div>
            <div class="text-left border-l border-white/10 pl-4">
              <span class="block text-[10px] font-mono font-bold text-accent-gold uppercase tracking-wider">Kampala Leads</span>
              <strong class="block text-lg font-black font-mono mt-0.5 text-[#faf8f4]">+210%</strong>
            </div>
            <div class="text-left border-l border-white/10 pl-4">
              <span class="block text-[10px] font-mono font-bold text-accent-gold uppercase tracking-wider">Performance</span>
              <strong class="block text-lg font-black font-mono mt-0.5 text-[#faf8f4]">100%</strong>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2" id="hero-cta-group">
            <a [href]="whatsappLink()" target="_blank" rel="noopener noreferrer" id="hero-primary-cta" class="group btn-premium-primary text-[11px] tracking-wider uppercase h-14 bg-accent-gold hover:bg-accent-gold-dark text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-accent-gold/15 cursor-pointer">
              <svg class="icon text-white" style="width:18px; height:18px;"><use href="#icon-whatsapp"/></svg>
              <span>Instant WhatsApp Scope</span>
            </a>
            <a routerLink="/portfolio" id="hero-secondary-cta" class="btn-premium-secondary text-[11px] tracking-wider uppercase h-14 font-bold rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/30 backdrop-blur-md cursor-pointer transition-all">
              Explore Craft Portfolio
            </a>
          </div>
        </div>

        <!-- Right Column: Interactive Browser Sandbox Showcase (Zero AI-Slop, 100% Pure UX Art) -->
        <div class="lg:col-span-6 w-full" id="hero-visual-showcase">
          <div class="bg-[#182317]/90 border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md">
            
            <!-- Safari Mac-style top control rail -->
            <div class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-[#121c11]/80 select-none">
              <div class="flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded-full bg-[#ff5f56]" title="Handcrafted"></span>
                <span class="w-3 h-3 rounded-full bg-[#ffbd2e]" title="Lightning Optimized"></span>
                <span class="w-3 h-3 rounded-full bg-[#27c93f]" title="Deploy Ready"></span>
              </div>
              <div class="bg-white/5 border border-white/15 rounded-lg px-4 py-1 text-[9px] font-mono text-slate-300 w-1/2 sm:w-2/3 text-center truncate">
                https://bilalweb.online/sandbox-pro
              </div>
              <div class="w-6 h-1"></div>
            </div>

            <!-- Tab Switching Buttons inside the browser -->
            <div class="grid grid-cols-3 border-b border-white/10 text-center select-none bg-[#142013]">
              <button 
                type="button"
                (click)="heroActiveTab.set('performance')"
                class="py-3 px-2 text-[10px] font-bold font-mono tracking-wider uppercase transition-all duration-200 focus:outline-none cursor-pointer border-b-2"
                [class.text-accent-gold]="heroActiveTab() === 'performance'"
                [class.border-accent-gold]="heroActiveTab() === 'performance'"
                [class.bg-white/5]="heroActiveTab() === 'performance'"
                [class.text-slate-400]="heroActiveTab() !== 'performance'"
                [class.border-transparent]="heroActiveTab() !== 'performance'"
              >
                ⚡ Speed Metrix
              </button>
              <button 
                type="button"
                (click)="heroActiveTab.set('ux')"
                class="py-3 px-2 text-[10px] font-bold font-mono tracking-wider uppercase transition-all duration-200 focus:outline-none cursor-pointer border-b-2"
                [class.text-accent-gold]="heroActiveTab() === 'ux'"
                [class.border-accent-gold]="heroActiveTab() === 'ux'"
                [class.bg-white/5]="heroActiveTab() === 'ux'"
                [class.text-slate-400]="heroActiveTab() !== 'ux'"
                [class.border-transparent]="heroActiveTab() !== 'ux'"
              >
                🎨 Custom UX
              </button>
              <button 
                type="button"
                (click)="heroActiveTab.set('momo')"
                class="py-3 px-2 text-[10px] font-bold font-mono tracking-wider uppercase transition-all duration-200 focus:outline-none cursor-pointer border-b-2"
                [class.text-accent-gold]="heroActiveTab() === 'momo'"
                [class.border-accent-gold]="heroActiveTab() === 'momo'"
                [class.bg-white/5]="heroActiveTab() === 'momo'"
                [class.text-slate-400]="heroActiveTab() !== 'momo'"
                [class.border-transparent]="heroActiveTab() !== 'momo'"
              >
                💳 MoMo Checks
              </button>
            </div>

            <!-- Dashboard Content Container with high contrast graphs representation -->
            <div class="p-6 sm:p-8 min-h-[280px] sm:min-h-[310px] flex flex-col justify-between text-left">
              
              <!-- TAB 1: PERFORMANCE -->
              @if (heroActiveTab() === 'performance') {
                <div class="space-y-5 animate-fade-in text-left">
                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <span class="text-[9px] uppercase font-bold tracking-widest text-[#778575] font-mono">Mobile Optimization Index</span>
                      <h4 class="text-base font-extrabold text-white">GENUINE PAGE DEPTH</h4>
                    </div>
                    <div class="w-14 h-14 rounded-full border-4 border-[#27c93f] flex items-center justify-center text-[13px] font-black font-mono text-[#27c93f] shadow-lg shadow-[#27c93f]/10">
                      99%
                    </div>
                  </div>
                  
                  <div class="space-y-2.5">
                    <div class="flex justify-between items-center text-xs">
                      <span class="text-slate-300 font-mono">First Contentful Paint (FCP)</span>
                      <strong class="text-white font-mono">0.28s</strong>
                    </div>
                    <div class="w-full bg-white/5 rounded-full h-1.5">
                      <div class="bg-[#27c93f] h-1.5 rounded-full w-[96%]"></div>
                    </div>
                  </div>

                  <div class="space-y-2.5">
                    <div class="flex justify-between items-center text-xs">
                      <span class="text-slate-300 font-mono">Mobile Score (No Bloatware)</span>
                      <strong class="text-white font-mono">100 / 100</strong>
                    </div>
                    <div class="w-full bg-white/5 rounded-full h-1.5">
                      <div class="bg-[#27c93f] h-1.5 rounded-full w-[100%]"></div>
                    </div>
                  </div>

                  <!-- Mini SVG Wave representing server-rendered millisecond response times -->
                  <div class="pt-4 flex items-center justify-between">
                    <span class="text-[9.5px] text-[#778575] font-mono uppercase tracking-wider">Ugandacell 3G/4G Network Ping Rate:</span>
                    <span class="font-mono text-[10px] text-[#27c93f] font-bold">14ms latency</span>
                  </div>
                  <div class="h-10 w-full relative">
                    <svg class="w-full h-full text-accent-gold" viewBox="0 0 300 40" fill="none" stroke="currentColor">
                      <path d="M0 30 Q 30 10, 60 25 T 120 15 T 180 32 T 240 10 T 300 18" stroke-width="2" stroke-linecap="round"/>
                      <path d="M0 30 Q 30 10, 60 25 T 120 15 T 180 32 T 240 10 T 300 18 L 300 40 L 0 40 Z" fill="currentColor" opacity="0.08"/>
                    </svg>
                  </div>
                </div>
              }

              <!-- TAB 2: ELITE UX CRAFT -->
              @if (heroActiveTab() === 'ux') {
                <div class="space-y-4 animate-fade-in text-left">
                  <div class="space-y-1">
                    <span class="text-[9px] uppercase font-bold tracking-widest text-[#778575] font-mono">High-Fidelity Component Control</span>
                    <h4 class="text-base font-extrabold text-white">BESPOKE BRANDING CONTROLS</h4>
                  </div>
                  
                  <div class="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-slate-300">Layout Elevation Profile</span>
                      <span class="px-2 py-0.5 bg-accent-gold/20 text-accent-gold font-mono rounded text-[9px] uppercase font-bold tracking-wider">Active</span>
                    </div>
                    <div class="h-[1px] bg-white/10"></div>
                    <!-- Mock component parameters simulating direct code configuration options list -->
                    <div class="grid grid-cols-2 gap-3 text-[10px] font-mono text-[#778575]">
                      <div class="flex items-center space-x-1.5">
                        <span class="text-[#27c93f]">✔</span>
                        <span>Tailwind v4 grid</span>
                      </div>
                      <div class="flex items-center space-x-1.5">
                        <span class="text-[#27c93f]">✔</span>
                        <span>W3C Accessible</span>
                      </div>
                      <div class="flex items-center space-x-1.5">
                        <span class="text-[#27c93f]">✔</span>
                        <span>Zoneless Angular</span>
                      </div>
                      <div class="flex items-center space-x-1.5">
                        <span class="text-[#27c93f]">✔</span>
                        <span>Fluid layout rails</span>
                      </div>
                    </div>
                  </div>

                  <p class="text-[11px] text-slate-300 leading-relaxed font-serif italic text-left">
                    "Every layout rail, text pairing, and shadow index is designed relative to your exact brand message. No generic visual templates."
                  </p>
                </div>
              }

              <!-- TAB 3: MOMO & LOCAL LEADS -->
              @if (heroActiveTab() === 'momo') {
                <div class="space-y-4 animate-fade-in text-left">
                  <div class="space-y-1">
                    <span class="text-[9px] uppercase font-bold tracking-widest text-[#778575] font-mono">Localized Commerce Integrations</span>
                    <h4 class="text-base font-extrabold text-white">UGANDA MOBILE MONEY ACTION CODES</h4>
                  </div>

                  <!-- Checkout device simulator -->
                  <div class="bg-white text-[#1f2b1d] rounded-xl p-4 border border-[#eae6dd] shadow-sm space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Select Payment Method:</span>
                      <span class="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold">Secure</span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-2 select-none">
                      <div class="border-2 border-[#ffb300] bg-[#fffde7] rounded-lg p-2.5 flex items-center justify-center space-x-2 cursor-pointer transition-transform hover:scale-[1.02]">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#ffb300]"></span>
                        <strong class="text-[10px] font-mono uppercase tracking-tight text-[#ff3d00]">MTN MoMo</strong>
                      </div>
                      <div class="border-2 border-[#e53935] bg-[#ffebee] rounded-lg p-2.5 flex items-center justify-center space-x-2 cursor-pointer transition-transform hover:scale-[1.02]">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#e53935]"></span>
                        <strong class="text-[10px] font-mono uppercase tracking-tight text-[#c62828]">Airtel Money</strong>
                      </div>
                    </div>

                    <div class="h-[1px] bg-slate-100"></div>
                    <div class="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Automated WhatsApp alert:</span>
                      <strong class="text-[#5c7257]">On checkout click</strong>
                    </div>
                  </div>

                  <p class="text-[10.5px] text-slate-300 leading-relaxed">
                    We construct triggers that direct client checkout selections immediately as clean formatting instructions to your business WhatsApp account or regional phone number.
                  </p>
                </div>
              }

              <!-- Bottom details -->
              <div class="pt-4 border-t border-white/10 flex items-center justify-between select-none">
                <span class="text-[9px] font-mono text-[#778575] uppercase tracking-widest">Aesthetic Framework</span>
                <span class="text-[9px] font-mono text-accent-gold font-bold uppercase tracking-widest">Stand-Alone Zoneless Code</span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- Services Section - Staggered Elegant Layout Inspired by the Green Header in image -->
    <section class="bg-[#4e6049] text-[#faf8f4] rounded-3xl py-16 px-6 sm:px-12 lg:px-16 shadow-lg space-y-12 mb-16">
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">Flexible Website Solutions</h2>
        <div class="h-1 w-16 bg-[#bf5d39] mx-auto rounded-full mt-4"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        @for (pkg of topPackages(); track pkg.id; let i = $index) {
          <!-- Portrait rounded cards showcasing the packages in Earth-Sage design -->
          <div 
            class="bg-white text-[#1f2b1d] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-8 relative hover:scale-[1.02] transition-all shadow-md"
            [class.md:translate-y-4]="i === 1"
          >
            <!-- Terracotta Badge overlay for recommending business package -->
            @if (pkg.id === 'business' || pkg.mostPopular) {
              <span class="absolute -top-3 left-6 bg-accent-gold text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Recommended
              </span>
            }

            <div class="space-y-6">
              <div class="w-12 h-12 rounded-full bg-[#faf8f4] flex items-center justify-center text-primary-blue border border-[#eae6dd]">
                <svg class="icon icon-md text-primary-blue" aria-hidden="true">
                  <use [attr.href]="'#' + getPackageIconId(pkg.id)"/>
                </svg>
              </div>
              <div class="space-y-2">
                <h3 class="text-xl font-bold text-[#1f2b1d] uppercase tracking-tight">{{ pkg.name }}</h3>
                <span class="block text-[10px] font-mono font-bold text-accent-gold uppercase tracking-wider">Fixed Kampala package</span>
                <p class="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {{ pkg.description }}
                </p>
              </div>
            </div>
            
            <div class="border-t border-[#eae6dd] pt-4 flex items-center justify-between">
              <span class="text-[10px] font-mono font-bold text-slate-400">Value Tier</span>
              <a routerLink="/services" class="text-xs text-primary-blue font-bold tracking-wide hover:text-primary-blue-dark flex items-center gap-1 min-h-[48px] px-2 rounded-lg" aria-label="View features for package">
                <span>View Features</span>
                <span>→</span>
              </a>
            </div>
          </div>
        } @empty {
          <div class="col-span-3 py-12 text-center text-sm text-[#faf8f4]/60">No packages configured yet.</div>
        }
      </div>

      <div class="text-center pt-6">
        <a routerLink="/services" class="inline-flex bg-accent-gold hover:bg-accent-gold-dark text-white font-bold text-xs uppercase tracking-widest py-4 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95 duration-150 cursor-pointer">
          Compare All Packages & Timelines
        </a>
        <p class="text-[10px] text-[#eae6dd]/80 font-mono tracking-wide mt-4">
          Affordable Kampala delivery timelines starting from 3 working days.
        </p>
      </div>
    </section>

    <!-- Trust indicators section matching the premium beige cards with gold icons at the bottom of imagery -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      <div class="bg-[#fcfaf6] border border-[#eae6dd] rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center space-y-4 shadow-sm hover:border-[#bf5d39]/40 transition-colors">
        <div class="w-12 h-12 rounded-full bg-[#fdfaf2] flex items-center justify-center border border-[#ece3ca] text-accent-gold">
          <svg class="icon icon-md text-accent-gold" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div class="space-y-1">
          <h4 class="text-sm font-bold text-[#1f2b1d] uppercase tracking-wider">Fast Uganda Speeds</h4>
          <p class="text-[11px] text-[#778575] leading-relaxed">Fully optimized page payloads that load in milliseconds on mobile devices.</p>
        </div>
      </div>

      <div class="bg-[#fcfaf6] border border-[#eae6dd] rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center space-y-4 shadow-sm hover:border-[#bf5d39]/40 transition-colors">
        <div class="w-12 h-12 rounded-full bg-[#fdfaf2] flex items-center justify-center border border-[#ece3ca] text-accent-gold">
          <svg class="icon icon-md text-accent-gold" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>
        <div class="space-y-1">
          <h4 class="text-sm font-bold text-[#1f2b1d] uppercase tracking-wider">Seamless MoMo Pay</h4>
          <p class="text-[11px] text-[#778575] leading-relaxed">Direct mobile billing links for MTN MoMo & Airtel payments without paperwork.</p>
        </div>
      </div>

      <div class="bg-[#fcfaf6] border border-[#eae6dd] rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center space-y-4 shadow-sm hover:border-[#bf5d39]/40 transition-colors">
        <div class="w-12 h-12 rounded-full bg-[#fdfaf2] flex items-center justify-center border border-[#ece3ca] text-accent-gold">
          <svg class="icon icon-md text-accent-gold" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>
        <div class="space-y-1">
          <h4 class="text-sm font-bold text-[#1f2b1d] uppercase tracking-wider">Lifetime Guarantee</h4>
          <p class="text-[11px] text-[#778575] leading-relaxed">Zero hidden subscription fees. You fully own and host your custom files.</p>
        </div>
      </div>
    </section>

    <!-- Why Choose Me Section - Handcrafted editorial details, styled with soft cream backgrounds -->
    <section id="why-me" class="py-16 border-t border-[#eae6dd] grid grid-cols-1 md:grid-cols-12 gap-12 items-start font-sans">
      <div class="md:col-span-4 space-y-4 text-left">
        <span class="small-label text-accent-gold">Core Standards</span>
        <h2 class="text-3xl font-extrabold text-[#1f2b1d] uppercase tracking-tight">Our Quality Guarantee</h2>
        <p class="text-xs sm:text-sm text-[#778575] leading-relaxed">
          While bloated template builders add unnecessary page weight and high hosting server requirements, I build pristine website structures manually using modern layout protocols.
        </p>
        <div class="pt-4 border-l-2 border-accent-gold pl-4 text-xs text-[#778575] font-mono italic">
          Bespoke design, coded in Uganda.
        </div>
      </div>

      <div class="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
        <!-- Local -->
        <div class="p-6 bg-white border border-[#eae6dd] rounded-2xl space-y-3 hover:border-[#bf5d39]/40 transition-all flex flex-col justify-between shadow-xs">
          <div>
            <div class="w-10 h-10 rounded-xl bg-primary-blue/5 border border-primary-blue/10 flex items-center justify-center text-primary-blue mb-4">
              <svg class="icon icon-sm text-primary-blue"><use href="#logo-uganda"/></svg>
            </div>
            <h3 class="text-base font-bold text-[#1f2b1d] uppercase tracking-tight">Localized User Experience</h3>
            <p class="text-xs text-[#778575] leading-relaxed mt-1">
              Every interface targets Kampala users: high speed, quick localized checkouts, clear maps links, and touch-target layout controls calibrated precisely for screen displays.
            </p>
          </div>
        </div>

        <!-- Speed -->
        <div class="p-6 bg-white border border-[#eae6dd] rounded-2xl space-y-3 hover:border-[#bf5d39]/40 transition-all flex flex-col justify-between shadow-xs">
          <div>
            <div class="w-10 h-10 rounded-xl bg-accent-gold/5 border border-accent-gold/15 flex items-center justify-center text-accent-gold mb-4">
              <svg class="icon icon-xs text-accent-gold"><use href="#icon-lightning"/></svg>
            </div>
            <h3 class="text-base font-bold text-[#1f2b1d] uppercase tracking-tight">Performance Architecture</h3>
            <p class="text-xs text-[#778575] leading-relaxed mt-1">
              Your page values score perfect load stats, conserving cellular bandwidth data and serving local client expectations instantly without delays.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to action block with premium clay/sage details -->
    <section class="border border-[#eae6dd] bg-white rounded-3xl p-8 sm:p-12 text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-sm mb-16" id="explore-cta-block">
      <div class="absolute top-0 right-0 w-32 h-32 bg-[#faf8f4] rounded-full translate-x-16 -translate-y-16"></div>
      <div class="lg:col-span-8 space-y-4 z-10 text-left">
        <h3 class="text-2xl sm:text-3xl font-extrabold text-[#1f2b1d] uppercase tracking-tight">WE PROVIDE YOU THE BEST EXPERIENCE</h3>
        <p class="text-xs sm:text-sm text-[#778575] max-w-xl">
          Everything matches actual professional expectations. Click through to explore live cases built to perfection for Ugandan business audiences. No sluggish builder systems.
        </p>
      </div>
      <div class="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end z-10 w-full">
        <a routerLink="/portfolio" class="btn-premium-primary text-[11px] tracking-wider uppercase text-center w-full shadow-md cursor-pointer bg-primary-blue">
          See Sample Projects
        </a>
        <a routerLink="/contact" class="btn-premium-secondary text-[11px] tracking-wider uppercase text-center w-full bg-[#faf8f4]/60 backdrop-blur-xs cursor-pointer border border-[#bf5d39] text-[#bf5d39] hover:bg-[#bf5d39]/5">
          Request Free Quote
        </a>
      </div>
    </section>

    <!-- Beautiful Interactive FAQ Accordion -->
    <section id="faq-section" class="py-16 border-t border-[#eae6dd] text-left">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div class="md:col-span-4 space-y-4 flex flex-col items-start">
          <h2 class="text-3xl font-extrabold text-[#1f2b1d] uppercase tracking-tight">Frequently Asked Questions</h2>
          <p class="text-xs text-[#778575] leading-relaxed">
            Have questions about physical delivery timelines, payment terms, or domain hosting registration? I've outlined clear answers below.
          </p>
          <a routerLink="/contact" class="text-xs tracking-wider uppercase font-bold text-primary-blue hover:text-primary-blue-dark flex items-center space-x-1 hover:translate-x-0.5 transition-all group min-h-[48px] px-3 -mx-3 rounded-lg focus:outline-none" aria-label="Ask a custom site question">
            <span>Ask a Custom Site Question</span>
            <span class="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </a>
        </div>
        <div class="md:col-span-8 space-y-4">
          @for (faq of faqs; track $index) {
            <div class="border border-[#eae6dd] rounded-2xl bg-white transition-all overflow-hidden hover:border-[#bf5d39]/35 shadow-xs">
              <button 
                type="button"
                (click)="activeFaq.set(activeFaq() === $index ? null : $index)"
                class="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-sans font-medium text-slate-900 hover:bg-[#faf8f4] transition-colors focus:outline-none cursor-pointer"
                [attr.aria-expanded]="activeFaq() === $index"
              >
                <span class="text-sm sm:text-base font-bold leading-normal text-[#1f2b1d] uppercase tracking-tight">{{ faq.q }}</span>
                <span class="flex-shrink-0 text-[#778575] transition-transform duration-200" [class.rotate-180]="activeFaq() === $index">
                  <svg class="w-5 h-5 animate-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
                  </svg>
                </span>
              </button>
              @if (activeFaq() === $index) {
                <div class="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#778575] leading-relaxed border-t border-[#eae6dd] animate-fade-in text-left">
                  {{ faq.a }}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Serving Businesses Across Kampala Section -->
    <section id="serving-locations" class="py-16 border-t border-[#eae6dd] text-left">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div class="md:col-span-4 space-y-3 font-sans">
          <h2 class="text-2xl font-extrabold text-[#1f2b1d] uppercase tracking-tight">Serving Businesses Across Kampala</h2>
          <p class="text-xs text-[#778575] leading-relaxed">
            Looking for a local web design contract on shell, offices, or remote alignment across greater Kampala?
          </p>
        </div>
        <div class="md:col-span-8">
          <div class="bg-white rounded-2xl p-6 sm:p-8 border border-[#eae6dd] shadow-xs">
            <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block mb-4">Central Region Local Delivery Neighborhoods:</span>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              @for (area of localAreas; track area) {
                <div class="flex items-center space-x-1.5 text-xs text-[#4d594b] font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary-blue"></span>
                  <span>{{ area }}</span>
                </div>
              }
            </div>
            <div class="h-[1px] bg-[#eae6dd] my-6"></div>
            <p class="text-[11px] text-[#778575] leading-relaxed font-serif italic text-left">
              "We fully optimize and structure local SEO metadata indices so that queries for professional web design services near Ntinda, Kira, Najjera, Makindye or Kololo fetch your local brand first."
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class HomeComponent {
  dataState = inject(DataState);
  activeFaq = signal<number | null>(null);
  heroActiveTab = signal<'performance' | 'ux' | 'momo'>('performance');

  private titleService = inject(Title);
  private metaService = inject(Meta);

  constructor() {
    this.titleService.setTitle('Web Design Kampala near me | Best Web Design Company Uganda - Bilal Web');
    this.metaService.updateTag({ name: 'description', content: 'Looking for professional web design near me in Kampala or Uganda? Bilal Web designs top-rated, mobile-optimized websites from UGX 500,000. Free domain, free web hosting, and WhatsApp buttons.' });
    this.metaService.updateTag({ name: 'keywords', content: 'web design near me, web design Kampala, website design Uganda, best web design company Kampala, website developers in Uganda, cheap website designer Kampala, freelance web developer Kampala, responsive websites Uganda, mobile money website, affordable website developers near me' });
  }

  localAreas = [
    'Makindye', 'Ntinda', 'Kira', 'Najjera', 
    'Kawempe', 'Rubaga', 'Nakawa', 'Kololo', 
    'Bugolobi', 'Muyenga', 'Wandegeya', 'Kabalagala'
  ];

  faqs = [
    {
      q: "How much does a website cost in Kampala?",
      a: "Websites start at UGX 500,000 for a starter landing page website. Full business sites start at UGX 1,200,000, and e-commerce stores from UGX 2,500,000. All packages include a free domain and hosting configuration for the first year."
    },
    {
      q: "Can I update the website myself after it's built?",
      a: "On the Business and E-Commerce packages, yes. You get a simple admin dashboard where you can edit text, change images, add products, and more without any coding needed. On the Starter Package, I handle updates for you. Minor changes are free, just WhatsApp me."
    },
    {
      q: "Do you offer physical consultations?",
      a: "Yes, we can arrange direct meetings in Nakawa, Kololo, Ntinda, or around Kampala Central, or correspond immediately via Zoom / WhatsApp channels."
    },
    {
      q: "What is included in your website packages?",
      a: "All website packages include unique professional code, responsive mobile layouts, free domain registration for the first year, free secure hosting config, local SEO configurations, and WhatsApp integration."
    },
    {
      q: "How long does it take to deploy a website?",
      a: "A starter landing page takes 3-5 days. Full business setups take 7-10 days. Complex e-commerce systems take 14-21 days depending on your products listing."
    },
    {
      q: "Can customers pay using Mobile Money?",
      a: "Yes. I construct custom tap actions linking directly to MTN MoMo or Airtel Money pay numbers to ensure secure local payment processing."
    }
  ];

  whatsappLink = computed(() => {
    const raw = this.dataState.whatsappNumber();
    const clean = raw.replace(/\+/g, '').replace(/[^0-9]/g, '');
    return `https://wa.me/${clean}`;
  });

  topPackages = computed(() => {
    return this.dataState.packages().slice(0, 3);
  });

  getPackageIconId(id: string): string {
    const map: Record<string, string> = {
      'starter': 'icon-page',
      'business': 'icon-building',
      'ecommerce': 'icon-cart',
      'one-page': 'icon-page',
      'redesign': 'icon-refresh',
      'maintenance': 'icon-wrench'
    };
    return map[id] || 'icon-info';
  }
}
