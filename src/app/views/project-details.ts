import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DataState, Project } from '../services/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-project-details',
  imports: [RouterLink],
  template: `
    <section class="py-8 space-y-12 animate-slide-up font-sans">
      
      <!-- Back to Portfolio breadcrumb -->
      <nav class="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#778575] text-left">
        <a routerLink="/portfolio" class="hover:text-accent-gold transition-colors font-bold">Portfolio</a>
        <span>/</span>
        <span class="text-[#1f2b1d] font-bold">{{ projectId() }} Showcase</span>
      </nav>

      @if (projectId() === 'furniture-3d') {
        <!-- 3D SHOWCASE CONFIGURATOR DESIGN -->
        <div class="space-y-8 text-left" id="showcase-furniture-3d">
          <div class="space-y-4">
            <span class="small-label text-accent-gold">INTERACTIVE 3D WEB Showcase</span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1f2b1d] uppercase tracking-tight">
              Lugogo 3D Furniture Studio
            </h1>
            <p class="text-xs sm:text-sm text-[#778575] leading-relaxed max-w-3xl">
              A real-time interactive 3D product customizer built as a case study for a premium furniture atelier in Lugogo, Kampala. Showcase interactive lighting, material swap, and dynamic price compilation optimized for low network cellular targets.
            </p>
          </div>

          <!-- Highlight Specs Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-4 sm:p-5 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd]">
              <strong class="block text-xl sm:text-2xl text-[#bf5d39] font-sans font-black">Under 1.2s</strong>
              <span class="text-[10px] font-mono font-bold text-[#778575] uppercase tracking-wider">Fast loading on MTN/Airtel 3G</span>
            </div>
            <div class="p-4 sm:p-5 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd]">
              <strong class="block text-xl sm:text-2xl text-[#bf5d39] font-sans font-black">Pure CSS 3D</strong>
              <span class="text-[10px] font-mono font-bold text-[#778575] uppercase tracking-wider">No heavy WebGL downloads</span>
            </div>
            <div class="p-4 sm:p-5 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd]">
              <strong class="block text-xl sm:text-2xl text-[#bf5d39] font-sans font-black">Live Quote</strong>
              <span class="text-[10px] font-mono font-bold text-[#778575] uppercase tracking-wider">Direct Ugx Calculator</span>
            </div>
            <div class="p-4 sm:p-5 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd]">
              <strong class="block text-xl sm:text-2xl text-[#bf5d39] font-sans font-black">Conversion</strong>
              <span class="text-[10px] font-mono font-bold text-[#778575] uppercase tracking-wider">Direct WhatsApp Specs Hook</span>
            </div>
          </div>

          <!-- THE 3D INTERACTIVE CUSTOMIZER AREA -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
            
            <!-- LEFT: 3D MODEL CANVAS VIEWPORT -->
            <div class="lg:col-span-7 space-y-4">
              <div 
                class="viewport-3d select-none relative w-full aspect-[4/3] border border-[#eae6dd] rounded-3xl flex items-center justify-center overflow-hidden shadow-md cursor-grab active:cursor-grabbing group"
                [style.background]="getLightingGradient()"
                (mousedown)="onDragStart($event)"
                (mousemove)="onDragMove($event)"
                (window:mouseup)="onDragEnd()"
                (touchstart)="onTouchStart($event)"
                (touchmove)="onTouchMove($event)"
                (window:touchend)="onDragEnd()"
                aria-label="3D Interactive Customization Canvas. Press and drag to rotate the lounge chair in space."
              >
                <!-- Camera / Angle reset helper indicator -->
                <div class="absolute top-4 left-4 flex flex-col space-y-1 z-10 font-mono text-[9px] text-[#778575] bg-white/70 backdrop-blur-xs px-3 py-2 rounded-xl border border-[#eae6dd]/40 select-none">
                  <span class="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[#1f2b1d]">
                    <span class="w-1.5 h-1.5 bg-[#4e6049] rounded-full" [class.animate-pulse]="autoSpin()"></span>
                    Camera State
                  </span>
                  <span>Yaw: {{ rotY().toFixed(0) }}° | Pitch: {{ rotX().toFixed(0) }}°</span>
                </div>

                <!-- Live Accent Badging -->
                <div class="absolute top-4 right-4 flex items-center space-x-2 z-10">
                  <span class="text-[8px] sm:text-[9px] bg-white/95 border border-[#eae6dd] text-[#bf5d39] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                    🛋️ 3D Perspective engine
                  </span>
                </div>

                <!-- THE 3D OBJECT SPACE -->
                <div class="scene-3d-wrapper">
                  <div class="scene-3d" [style.transform]="'rotateX(' + rotX() + 'deg) rotateY(' + rotY() + 'deg)'">
                    
                    <!-- SEAT CUSHION PART -->
                    <div class="part-3d" style="width: 120px; height: 22px; position: absolute; left: calc(50% - 60px); top: calc(50% - 11px); transform: translate3d(0, 10px, 0); transform-style: preserve-3d;">
                      <div class="face-3d" style="width: 120px; height: 22px; transform: rotateY(0deg) translateZ(50px);" [style.background]="activeCushion().front"></div>
                      <div class="face-3d" style="width: 120px; height: 22px; transform: rotateY(180deg) translateZ(50px);" [style.background]="activeCushion().back"></div>
                      <div class="face-3d" style="width: 100px; height: 22px; left: 10px; transform: rotateY(-90deg) translateZ(60px);" [style.background]="activeCushion().left"></div>
                      <div class="face-3d" style="width: 100px; height: 22px; left: 10px; transform: rotateY(90deg) translateZ(60px);" [style.background]="activeCushion().right"></div>
                      <div class="face-3d" style="width: 120px; height: 100px; top: -39px; transform: rotateX(90deg) translateZ(11px);" [style.background]="activeCushion().top"></div>
                      <div class="face-3d" style="width: 120px; height: 100px; top: -39px; transform: rotateX(-90deg) translateZ(11px);" [style.background]="activeCushion().back"></div>
                    </div>

                    <!-- BACKREST PART -->
                    <div class="part-3d" style="width: 120px; height: 72px; position: absolute; left: calc(50% - 60px); top: calc(50% - 36px); transform: translate3d(0, -35px, -45px) rotateX(-12deg); transform-style: preserve-3d;">
                      <div class="face-3d" style="width: 120px; height: 72px; transform: rotateY(0deg) translateZ(7px);" [style.background]="activeCushion().front"></div>
                      <div class="face-3d" style="width: 120px; height: 72px; transform: rotateY(180deg) translateZ(7px);" [style.background]="activeCushion().back"></div>
                      <div class="face-3d" style="width: 14px; height: 72px; left: 53px; transform: rotateY(-90deg) translateZ(60px);" [style.background]="activeCushion().left"></div>
                      <div class="face-3d" style="width: 14px; height: 72px; left: 53px; transform: rotateY(90deg) translateZ(60px);" [style.background]="activeCushion().right"></div>
                      <div class="face-3d" style="width: 120px; height: 14px; top: 29px; transform: rotateX(90deg) translateZ(36px);" [style.background]="activeCushion().top"></div>
                      <div class="face-3d" style="width: 120px; height: 14px; top: 29px; transform: rotateX(-90deg) translateZ(36px);" [style.background]="activeCushion().back"></div>
                    </div>

                    <!-- LEFT WOOD ASSEMBLY -->
                    <div class="part-3d" style="width: 12px; height: 85px; position: absolute; left: calc(50% - 6px); top: calc(50% - 42.5px); transform: translate3d(-65px, -10px, 0px); transform-style: preserve-3d;">
                      <div class="face-3d" style="width: 12px; height: 85px; transform: rotateY(0deg) translateZ(55px);" [style.background]="activeWood().front">
                        <!-- Brass rivet accents front of left assembly -->
                        @if (brassAccents()) {
                          <div class="absolute w-[6px] h-[6px] bg-amber-400 rounded-full border border-amber-600/50 shadow-xs animate-pulse" style="left: 3px; top: 12px; transform: translateZ(1px);"></div>
                          <div class="absolute w-[6px] h-[6px] bg-amber-400 rounded-full border border-amber-600/50 shadow-xs animate-pulse" style="left: 3px; top: 70px; transform: translateZ(1px);"></div>
                        }
                      </div>
                      <div class="face-3d" style="width: 12px; height: 85px; transform: rotateY(180deg) translateZ(55px);" [style.background]="activeWood().back"></div>
                      <div class="face-3d" style="width: 110px; height: 85px; left: -49px; transform: rotateY(-90deg) translateZ(6px);" [style.background]="activeWood().left">
                        <!-- Accents on the outer left face -->
                        @if (brassAccents()) {
                          <div class="absolute w-[6px] h-[6px] bg-amber-400 rounded-full border border-amber-600/40 shadow-xs" style="left: 20px; top: 12px; transform: translateZ(1px);"></div>
                          <div class="absolute w-[6px] h-[6px] bg-amber-400 rounded-full border border-amber-600/40 shadow-xs" style="left: 90px; top: 12px; transform: translateZ(1px);"></div>
                        }
                      </div>
                      <div class="face-3d" style="width: 110px; height: 85px; left: -49px; transform: rotateY(90deg) translateZ(6px);" [style.background]="activeWood().right"></div>
                      <div class="face-3d" style="width: 12px; height: 110px; top: -12.5px; transform: rotateX(90deg) translateZ(42.5px);" [style.background]="activeWood().top"></div>
                      <div class="face-3d" style="width: 12px; height: 110px; top: -12.5px; transform: rotateX(-90deg) translateZ(42.5px);" [style.background]="activeWood().back"></div>
                    </div>

                    <!-- RIGHT WOOD ASSEMBLY -->
                    <div class="part-3d" style="width: 12px; height: 85px; position: absolute; left: calc(50% - 6px); top: calc(50% - 42.5px); transform: translate3d(65px, -10px, 0px); transform-style: preserve-3d;">
                      <div class="face-3d" style="width: 12px; height: 85px; transform: rotateY(0deg) translateZ(55px);" [style.background]="activeWood().front">
                        <!-- Brass rivet accents front of right assembly -->
                        @if (brassAccents()) {
                          <div class="absolute w-[6px] h-[6px] bg-amber-400 rounded-full border border-amber-600/50 shadow-xs animate-pulse" style="left: 3px; top: 12px; transform: translateZ(1px);"></div>
                          <div class="absolute w-[6px] h-[6px] bg-amber-400 rounded-full border border-amber-600/50 shadow-xs animate-pulse" style="left: 3px; top: 70px; transform: translateZ(1px);"></div>
                        }
                      </div>
                      <div class="face-3d" style="width: 12px; height: 85px; transform: rotateY(180deg) translateZ(55px);" [style.background]="activeWood().back"></div>
                      <div class="face-3d" style="width: 110px; height: 85px; left: -49px; transform: rotateY(-90deg) translateZ(6px);" [style.background]="activeWood().left"></div>
                      <div class="face-3d" style="width: 110px; height: 85px; left: -49px; transform: rotateY(90deg) translateZ(6px);" [style.background]="activeWood().right">
                        <!-- Accents on the outer right face -->
                        @if (brassAccents()) {
                          <div class="absolute w-[6px] h-[6px] bg-amber-400 rounded-full border border-amber-600/40 shadow-xs" style="left: 20px; top: 12px; transform: translateZ(1px);"></div>
                          <div class="absolute w-[6px] h-[6px] bg-amber-400 rounded-full border border-amber-600/40 shadow-xs" style="left: 90px; top: 12px; transform: translateZ(1px);"></div>
                        }
                      </div>
                      <div class="face-3d" style="width: 12px; height: 110px; top: -12.5px; transform: rotateX(90deg) translateZ(42.5px);" [style.background]="activeWood().top"></div>
                      <div class="face-3d" style="width: 12px; height: 110px; top: -12.5px; transform: rotateX(-90deg) translateZ(42.5px);" [style.background]="activeWood().back"></div>
                    </div>

                  </div>
                </div>

                <!-- Helper mouse/touch instruction panel -->
                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] text-[#778575] font-sans pointer-events-none select-none bg-white/75 backdrop-blur-xs px-3.5 py-2.5 rounded-2xl border border-[#eae6dd]/40">
                  <span class="flex items-center gap-1.5 font-medium">
                    🖱️ Drag to rotate 3D view
                  </span>
                  <button (click)="resetCamera(); $event.stopPropagation();" class="pointer-events-auto bg-[#bf5d39] text-white font-bold text-[9px] uppercase px-2.5 py-1 rounded-lg shrink-0 cursor-pointer shadow-xs border-none">
                    Reset Camera Mode
                  </button>
                </div>
              </div>

              <!-- Extra Camera and lighting control switches buttons bar -->
              <div class="flex flex-wrap items-center justify-between gap-3 bg-[#fcfaf6] border border-[#eae6dd] p-4 rounded-2xl font-sans">
                <div class="flex items-center space-x-2">
                  <span class="text-xs font-mono font-bold text-[#778575] uppercase">Live Rotation:</span>
                  <button 
                    (click)="autoSpin.set(!autoSpin())" 
                    class="px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors border shadow-xs cursor-pointer"
                    [class]="autoSpin() ? 'bg-emerald-50 border-[#4e6049]/35 text-[#4e6049]' : 'bg-white border-[#eae6dd] text-[#778575]'"
                  >
                    {{ autoSpin() ? '● ACTIVE SPINNING' : '○ STATIC VIEW' }}
                  </button>
                </div>

                <div class="flex items-center space-x-2">
                  <span class="text-xs font-mono font-bold text-[#778575] uppercase">Showcase Lighting:</span>
                  <div class="inline-flex rounded-lg shadow-sm bg-white border border-[#eae6dd] p-0.5">
                    @for (light of ['golden', 'studio', 'evening']; track light) {
                      <button 
                        (click)="lightingScenario.set(light)" 
                        class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md transition-colors cursor-pointer border-none font-mono"
                        [class]="lightingScenario() === light ? 'bg-[#bf5d39] text-white' : 'text-[#778575] hover:bg-[#eae6dd]/20'"
                      >
                        {{ light }}
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- RIGHT: CONFIGURATOR INPUT PANEL -->
            <div class="lg:col-span-5 space-y-6">
              
              <!-- CUSHION MATERIAL SELECTOR -->
              <div class="bg-[#fcfaf6] border border-[#eae6dd] p-5 rounded-2xl space-y-4">
                <div class="space-y-1">
                  <span class="text-[9px] font-mono font-bold uppercase tracking-widest text-[#778575] block">Customize Option 1</span>
                  <h3 class="text-sm font-bold text-[#1f2b1d] uppercase font-sans tracking-tight">Armchair Cushion fabric</h3>
                </div>
                
                <div class="grid grid-cols-2 gap-2.5">
                  @for (cushion of cushionMaterials; track cushion.id) {
                    <button 
                      (click)="cushionType.set(cushion.id)"
                      class="flex flex-col text-left p-3 rounded-xl border transition-all text-xs cursor-pointer shadow-xs relative"
                      [class]="cushionType() === cushion.id ? 'bg-white border-[#bf5d39] ring-2 ring-[#bf5d39]/10' : 'bg-white border-[#eae6dd] hover:border-[#bf5d39]/40'"
                    >
                      <div class="flex items-center space-x-2 mb-1.5">
                        <span class="w-4 h-4 rounded-full border border-black/10 inline-block shrink-0" [style.background]="cushion.front"></span>
                        <span class="font-bold text-[#1f2b1d] truncate">{{ cushion.name }}</span>
                      </div>
                      <span class="text-[10px] text-[#778575] line-clamp-1 leading-snug">{{ cushion.text }}</span>
                      
                      @if (cushion.price > 0) {
                        <span class="text-[8px] font-mono font-bold text-accent-gold mt-1.5">+{{ formatUgx(cushion.price) }} UGX</span>
                      } @else {
                        <span class="text-[8px] font-mono font-bold text-[#778575]/70 mt-1.5">Included</span>
                      }
                    </button>
                  }
                </div>
              </div>

              <!-- WOOD ASSEMBLIES SELECTOR -->
              <div class="bg-[#fcfaf6] border border-[#eae6dd] p-5 rounded-2xl space-y-4">
                <div class="space-y-1">
                  <span class="text-[9px] font-mono font-bold uppercase tracking-widest text-[#778575] block">Customize Option 2</span>
                  <h3 class="text-sm font-bold text-[#1f2b1d] uppercase font-sans tracking-tight">Solid Hardwood Timber Frame</h3>
                </div>

                <div class="space-y-2">
                  @for (wood of woodTypes; track wood.id) {
                    <button 
                      (click)="woodType.set(wood.id)"
                      class="w-full flex items-center justify-between p-3.5 rounded-xl border bg-white transition-all text-xs text-left cursor-pointer shadow-xs"
                      [class]="woodType() === wood.id ? 'border-[#bf5d39] ring-2 ring-[#bf5d39]/10' : 'border-[#eae6dd] hover:border-[#bf5d39]/40'"
                    >
                      <div class="flex items-center space-x-2 text-left">
                        <span class="w-5 h-5 rounded-lg border border-black/10 inline-block shrink-0" [style.background]="wood.front"></span>
                        <div class="space-y-0.5">
                          <strong class="text-[#1f2b1d] block text-xs">{{ wood.name }}</strong>
                          <span class="text-[10px] text-[#778575] block line-clamp-1 truncate max-w-[210px]">{{ wood.text }}</span>
                        </div>
                      </div>

                      @if (wood.price > 0) {
                        <span class="text-[9px] font-mono font-bold text-accent-gold shrink-0">+{{ formatUgx(wood.price) }} UGX</span>
                      } @else {
                        <span class="text-[9px] font-mono font-bold text-[#778575]/70 shrink-0 font-medium">Included</span>
                      }
                    </button>
                  }
                </div>
              </div>

              <!-- ACCENTS TOGGLE BOARD -->
              <div class="bg-[#fcfaf6] border border-[#eae6dd] p-5 rounded-2xl space-y-3 font-sans">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5 text-left">
                    <h3 class="text-xs font-bold text-[#1f2b1d] uppercase tracking-tight">Metallic Hardware Studs</h3>
                    <p class="text-[10px] text-[#778575]">Add shimmering polished golden bolts on the frame accents.</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" [checked]="brassAccents()" (change)="brassAccents.set(!brassAccents())" class="sr-only peer" />
                    <div class="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bf5d39]"></div>
                  </label>
                </div>
                @if (brassAccents()) {
                  <div class="flex items-center justify-between text-[10px] font-mono font-bold text-accent-gold border-t border-[#eae6dd]/40 pt-1.5">
                    <span>Hardware Premium Tax:</span>
                    <span>+100,000 UGX</span>
                  </div>
                }
              </div>

              <!-- DYNAMIC QUOTATION CARD -->
              <div class="bg-[#4e6049] text-[#faf8f4] p-6 rounded-2xl space-y-4 shadow-md text-left">
                <div class="space-y-1">
                  <span class="text-[9px] font-mono font-bold text-[#eae6dd]/75 uppercase tracking-wider block">Estimated Production cost</span>
                  
                  <div class="flex items-baseline space-x-2">
                    <span class="text-2xl sm:text-3xl font-black font-sans">
                      UGX {{ formatUgx(totalPrice()) }}
                    </span>
                    <span class="text-[10px] font-mono font-bold text-accent-gold uppercase select-none">VAT Inclusive</span>
                  </div>
                </div>

                <p class="text-[10px] text-[#eae6dd] leading-normal font-sans">
                  The compiled value updates dynamically as material swappers are clicked. This is an interactive customizer prototype configured for bespoke brand engagements.
                </p>

                <div class="pt-2 border-t border-white/10">
                  <button 
                    (click)="compileWhatsAppOrder()" 
                    class="w-full bg-[#bf5d39] hover:bg-[#9e4624] text-[#faf8f4] text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-xs transition-transform cursor-pointer border-none uppercase tracking-wider"
                  >
                    <span>💬 Quote Specs via WhatsApp</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          <!-- PROJECT SUMMARY -->
          <div class="p-8 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd] space-y-4">
            <h4 class="font-bold text-[#1f2b1d] uppercase tracking-tight">Technology Highlights & Conversion Strategy</h4>
            <p class="text-xs sm:text-sm text-[#778575] leading-relaxed">
              This visualizer displays three interlocking structural 3D matrix components using flat, raw CSS perspective projection. Bypassing heavy WebGL canvas libraries like Three.js yields instantaneous cellular network load times (<span class="font-bold">under 1.2s</span>) with zero processor drainage on mid-tier Android smartphones common around Kampala.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <a [routerLink]="['/contact']" [queryParams]="{ package: 'Premium 3D Customizer Site' }" class="bg-[#bf5d39] hover:bg-[#9e4624] text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl transition-all shadow-xs text-center border-none">
                Request Similar 3D Customizer Layout
              </a>
            </div>
          </div>
        </div>
      } @else if (projectId() === 'coffee') {
        <!-- Kampala Fresh Coffee Showcase -->
        <div class="space-y-8 text-left" id="showcase-coffee">
          <div class="space-y-4">
            <span class="small-label text-accent-gold">CAFE CASE STUDY</span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1f2b1d] uppercase tracking-tight">
              Kampala Fresh Coffee
            </h1>
            <p class="text-xs sm:text-sm text-[#778575] leading-relaxed max-w-3xl">
              An ultra-lightweight website built specifically for a boutique cafe in Bugolobi, Kampala. Designed to capture local delivery orders directly via WhatsApp with zero drag or latency on local network speeds.
            </p>
          </div>

          <!-- Highlight Specs Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-6 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd]">
              <strong class="block text-2xl text-[#bf5d39] font-sans font-black">Under 1.5s</strong>
              <span class="text-[10px] font-mono font-bold text-[#778575] uppercase tracking-wider">Load speed on 3G</span>
            </div>
            <div class="p-6 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd]">
              <strong class="block text-2xl text-[#bf5d39] font-sans font-black">Responsive</strong>
              <span class="text-[10px] font-mono font-bold text-[#778575] uppercase tracking-wider">Designed for phones</span>
            </div>
            <div class="p-6 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd]">
              <strong class="block text-2xl text-[#bf5d39] font-sans font-black">WhatsApp</strong>
              <span class="text-[10px] font-mono font-bold text-[#778575] uppercase tracking-wider">Checkout Rails</span>
            </div>
            <div class="p-6 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd]">
              <strong class="block text-2xl text-[#bf5d39] font-sans font-black">Local Focus</strong>
              <span class="text-[10px] font-mono font-bold text-[#778575] uppercase tracking-wider">Optimized Google SEO</span>
            </div>
          </div>

          <!-- The Live App Preview (Dedicated full page iframe mockup!) -->
          <div id="live-preview-box" class="border border-[#eae6dd] rounded-3xl overflow-hidden shadow-xl bg-[#faf8f4]">
            <div class="bg-[#4e6049] text-[#faf8f4] px-4 py-3.5 flex items-center justify-between border-b border-[#eae6dd]">
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-full bg-accent-gold inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-white/20 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-white/10 inline-block"></span>
                <span class="hidden sm:inline-block font-mono text-[10px] uppercase font-bold tracking-widest pl-2 text-white/80">Live Browser Mockup</span>
              </div>
              <div class="bg-black/15 text-white/95 px-3 py-1 rounded-lg text-xs font-mono w-1/2 max-w-sm text-center truncate">
                https://kampalafreshcoffee.ug
              </div>
              <span class="text-[9px] bg-accent-gold text-white font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">ACTIVE DEMO</span>
            </div>

            <div class="p-6 sm:p-12 space-y-8 bg-[#fdfbf7] text-[#1f2b1d]">
              <header class="text-center space-y-2">
                <svg class="icon text-accent-gold mx-auto" style="width: 48px; height: 48px;" aria-hidden="true"><use href="#icon-coffee"/></svg>
                <h2 class="text-3xl font-serif font-black text-[#1f2b1d] uppercase tracking-tight">KAMPALA FRESH COFFEE</h2>
                <p class="text-[10px] tracking-widest text-[#778575] font-mono uppercase font-bold">Volcanic Arabica beans sorted by hand</p>
              </header>

              <div class="max-w-md mx-auto bg-white/95 p-6 sm:p-8 rounded-2xl border border-[#eae6dd] space-y-6 shadow-xs text-left">
                <h3 class="text-lg font-bold border-b border-[#eae6dd] pb-3 text-[#1f2b1d] uppercase tracking-tight">Cafe Specials</h3>
                
                <ul class="space-y-4 font-sans">
                  <li class="flex items-center justify-between">
                    <div>
                      <strong class="text-sm text-[#1f2b1d]">Bugisu Mountains Espresso</strong>
                      <p class="text-xs text-[#778575]">Premium hand-sorted rich volcanic Mt. Elgon beans</p>
                    </div>
                    <span class="text-xs font-black font-mono text-accent-gold bg-[#bf5d39]/5 border border-[#bf5d39]/10 px-3 py-1.5 rounded-lg">10,000 UGX</span>
                  </li>
                  <li class="flex items-center justify-between">
                    <div>
                      <strong class="text-sm text-[#1f2b1d]">Kampala Sunrise Double Shot</strong>
                      <p class="text-xs text-[#778575]">Volcanic beans, thick crema morning burst</p>
                    </div>
                    <span class="text-xs font-black font-mono text-accent-gold bg-[#bf5d39]/5 border border-[#bf5d39]/10 px-3 py-1.5 rounded-lg">5,000 UGX</span>
                  </li>
                  <li class="flex items-center justify-between">
                    <div>
                      <strong class="text-sm text-[#1f2b1d]">Bugolobi Heights Velvet Latte</strong>
                      <p class="text-xs text-[#778575]">Traditional fresh cow dairy over rich double roast</p>
                    </div>
                    <span class="text-xs font-black font-mono text-accent-gold bg-[#bf5d39]/5 border border-[#bf5d39]/10 px-3 py-1.5 rounded-lg">7,000 UGX</span>
                  </li>
                </ul>

                <div class="bg-[#faf8f4] border border-[#eae6dd] p-4 rounded-xl text-center space-y-3">
                  <p class="text-xs text-[#4d594b] font-semibold flex items-center justify-center gap-1">
                    <svg class="icon icon-sm text-accent-gold flex-shrink-0 animate-bounce"><use href="#icon-location"/></svg>
                    <span>Bugolobi Heights, Plot 49 Bandali Rise, Kampala</span>
                  </p>
                  <a [routerLink]="['/contact']" [queryParams]="{ package: 'Coffee Shop Site Design' }" class="w-full bg-[#bf5d39] hover:bg-[#9e4624] text-white text-xs font-bold py-3 rounded-lg block text-center transition-colors uppercase tracking-widest border-none">
                    Order Delivery (Interactive Quote Trigger)
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-8 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd] space-y-4">
            <h4 class="font-bold text-[#1f2b1d] uppercase tracking-tight">Project Overview & Insights</h4>
            <p class="text-xs sm:text-sm text-[#778575] leading-relaxed">
              This layout features a single page, lightning fast layout that bypasses heavy image assets. By utilizing crisp vector icons, elegant borders, clean typographic headings, and high-contrast labels, the platform satisfies luxury design scores while executing flawlessly under Kampalan cellular data packet speed caps.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <a [routerLink]="['/contact']" [queryParams]="{ package: 'Coffee Shop Package' }" class="bg-[#bf5d39] hover:bg-[#9e4624] text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl transition-all shadow-xs text-center border-none">
                Order Site Like This
              </a>
            </div>
          </div>
        </div>
      }

      @if (projectId() === 'barber') {
        <!-- StyleHub Barber Showcase -->
        <div class="space-y-8 text-left" id="showcase-barber">
          <div class="space-y-4">
            <span class="small-label text-accent-gold">BARBERING CASE STUDY</span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1f2b1d] uppercase tracking-tight">
              StyleHub Barber Shop
            </h1>
            <p class="text-xs sm:text-sm text-[#778575] leading-relaxed max-w-3xl">
              A premium, high-density styled boutique and booking page built for a premier groom boutique next to Shell, Kampala Road.
            </p>
          </div>

          <!-- Specs -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800">
              <strong class="block text-2xl text-[#bf5d39] font-sans font-black">Under 1.7s</strong>
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-widest">MTN/Airtel Speed</span>
            </div>
            <div class="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800">
              <strong class="block text-2xl text-[#bf5d39] font-sans font-black">Zero Lag</strong>
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Direct Buttons</span>
            </div>
            <div class="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800">
              <strong class="block text-2xl text-[#bf5d39] font-sans font-black">Interactive</strong>
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Rate calculator</span>
            </div>
            <div class="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800">
              <strong class="block text-2xl text-[#bf5d39] font-sans font-black">SEO Ready</strong>
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Kampala Keywords</span>
            </div>
          </div>

          <!-- Browser container -->
          <div id="live-preview-box" class="border border-[#eae6dd] rounded-3xl overflow-hidden shadow-xl bg-slate-900">
            <div class="bg-slate-850 text-slate-300 px-4 py-3.5 flex items-center justify-between border-b border-slate-950">
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-full bg-accent-gold inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-white/20 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-white/10 inline-block"></span>
                <span class="hidden sm:inline-block font-mono text-[10px] uppercase font-bold text-slate-400 pl-2">Browser Interface</span>
              </div>
              <div class="bg-slate-800 text-slate-100 px-3 py-1 rounded-lg text-xs font-mono w-1/2 max-w-sm text-center truncate">
                https://stylehubbarbershop.ug
              </div>
              <span class="text-[9px] bg-accent-gold text-white font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">LIVE PREVIEW</span>
            </div>

            <div class="p-6 sm:p-12 space-y-8 bg-slate-950 text-slate-100 text-left">
              <header class="text-center space-y-2">
                <svg class="icon text-accent-gold mx-auto" style="width: 48px; height: 48px;" aria-hidden="true"><use href="#icon-barber"/></svg>
                <h2 class="text-3xl font-black text-rose-500 uppercase tracking-tight font-sans">STYLEHUB BARBER</h2>
                <p class="text-[10px] tracking-wider text-slate-400 font-mono uppercase">Master Grooming & Line Artistry</p>
              </header>

              <div class="max-w-md mx-auto bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
                <h3 class="text-lg font-bold border-b border-slate-800 pb-3 text-rose-300 uppercase tracking-wide">Services & Rates</h3>
                
                <ul class="space-y-4 text-xs sm:text-sm">
                  <li class="flex items-center justify-between">
                    <div>
                      <strong class="text-slate-100">Classic Gentleman's Cut</strong>
                      <p class="text-xs text-slate-400 font-sans">Razor finishing, styled lines with hot compress</p>
                    </div>
                    <span class="text-xs font-black font-mono text-amber-400">15,000 UGX</span>
                  </li>
                  <li class="flex items-center justify-between">
                    <div>
                      <strong class="text-slate-100">Beard Sculpting & Softening</strong>
                      <p class="text-xs text-slate-400 font-sans">Symmetrical edge hot towel steam treatment</p>
                    </div>
                    <span class="text-xs font-black font-mono text-amber-400">10,000 UGX</span>
                  </li>
                  <li class="flex items-center justify-between font-sans">
                    <div>
                      <strong class="text-slate-100">Clay Facial Treatment</strong>
                      <p class="text-xs text-slate-400 font-sans">Clogged pore extraction treatment</p>
                    </div>
                    <span class="text-xs font-black font-mono text-amber-400">25,000 UGX</span>
                  </li>
                </ul>

                <div class="bg-black/40 border border-slate-800 p-4 rounded-xl text-center space-y-3">
                  <p class="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-sans">
                    <svg class="icon icon-sm text-slate-400 flex-shrink-0"><use href="#icon-location"/></svg>
                    <span>Kireka Main Stage, Kampala Rd. (Opposite Shell)</span>
                  </p>
                  <a [routerLink]="['/contact']" [queryParams]="{ package: 'Barber Shop Appointment Site' }" class="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 rounded-lg block text-center transition-colors uppercase tracking-widest font-sans border-none">
                    Book appointment
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="p-8 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd] space-y-4">
            <h4 class="font-bold text-[#1f2b1d] uppercase tracking-tight font-sans">Project Summary</h4>
            <p class="text-xs sm:text-sm text-[#778575] leading-relaxed">
              This layout exhibits a luxury dark aesthetic. Utilizing dramatic rose and contrasting amber colors over pure slate-black surfaces yields a VIP style profile while preserving smartphone battery rates.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <a [routerLink]="['/contact']" [queryParams]="{ package: 'Barber Shop Package' }" class="bg-[#bf5d39] hover:bg-[#9e4624] text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl transition-all shadow-xs text-center border-none">
                Order Site Like This
              </a>
            </div>
          </div>
        </div>
      }

      @if (projectId() === 'fashion') {
        <!-- Kampala Fashion Hub Showcase -->
        <div class="space-y-8 text-left" id="showcase-fashion">
          <div class="space-y-4">
            <span class="small-label text-accent-gold">BOUTIQUE CASE STUDY</span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1f2b1d] uppercase tracking-tight">
              Kampala Fashion Hub
            </h1>
            <p class="text-xs sm:text-sm text-[#778575] leading-relaxed max-w-3xl">
              A fashion-forward catalog representing premium African fabrics, custom kitenge wax prints, and structured double-breasted blazers in Wandegeya, Kampala.
            </p>
          </div>

          <!-- Specs -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-6 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd]">
              <strong class="block text-2xl text-[#bf5d39] font-sans font-black">Under 1.6s</strong>
              <span class="text-[10px] font-mono text-[#778575] uppercase tracking-widest">MTN/Airtel Speed</span>
            </div>
            <div class="p-6 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd]">
              <strong class="block text-2xl text-[#bf5d39] font-sans font-black">Catalog</strong>
              <span class="text-[10px] font-mono text-[#778575] uppercase tracking-widest font-sans">Flexible Wax Prints</span>
            </div>
            <div class="p-6 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd]">
              <strong class="block text-2xl text-[#bf5d39] font-sans font-black">MoMo Ready</strong>
              <span class="text-[10px] font-mono text-[#778575] uppercase tracking-widest">Mobile Checkout</span>
            </div>
            <div class="p-6 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd]">
              <strong class="block text-2xl text-[#bf5d39] font-sans font-black">SEO Optimized</strong>
              <span class="text-[10px] font-mono text-[#778575] uppercase tracking-widest">Google Mapping</span>
            </div>
          </div>

          <!-- Browser Mock -->
          <div id="live-preview-box" class="border border-[#eae6dd] rounded-3xl overflow-hidden shadow-xl bg-indigo-50">
            <div class="bg-[#4e6049] text-[#faf8f4] px-4 py-3.5 flex items-center justify-between border-b border-[#eae6dd]">
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-full bg-accent-gold inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-white/20 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-white/10 inline-block"></span>
                <span class="hidden sm:inline-block font-mono text-[10px] uppercase font-bold pl-2">Mock Browser</span>
              </div>
              <div class="bg-black/15 text-white px-3 py-1 rounded-lg text-xs font-mono w-1/2 max-w-sm text-center truncate">
                https://kampalafashionhub.ug
              </div>
              <span class="text-[9px] bg-accent-gold text-white font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">LIVE PREVIEW</span>
            </div>

            <div class="p-6 sm:p-12 bg-indigo-50 text-indigo-950">
              <header class="text-center space-y-2">
                <svg class="icon text-indigo-900 mx-auto" style="width: 48px; height: 48px;" aria-hidden="true"><use href="#icon-fashion"/></svg>
                <h2 class="text-3xl font-sans tracking-tight font-black text-indigo-900 border-b border-indigo-200 pb-3 uppercase">Kampala Fashion Hub</h2>
                <p class="text-[10px] tracking-widest text-[#778575] font-mono uppercase font-bold">Traditional & Modern Tailored Masterpieces</p>
              </header>

              <div class="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-indigo-100 shadow-md space-y-6">
                <h3 class="text-base font-bold text-indigo-900 border-b border-indigo-50 pb-2 text-left uppercase tracking-wider">Latest Collection</h3>
                
                <ul class="space-y-4">
                  <li class="flex items-center justify-between w-full">
                    <div class="text-left">
                      <strong class="text-sm text-indigo-950">Premium Kitenge Summer Flare</strong>
                      <p class="text-xs text-stone-500">100% fine cotton traditional print</p>
                    </div>
                    <span class="text-xs font-black font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">65,000 UGX</span>
                  </li>
                  <li class="flex items-center justify-between w-full">
                    <div class="text-left">
                      <strong class="text-sm text-indigo-950 font-sans">Slit-Cut Groom Blazer</strong>
                      <p class="text-xs text-stone-500">Form-structured double-breasted wear</p>
                    </div>
                    <span class="text-xs font-black font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">120,000 UGX</span>
                  </li>
                  <li class="flex items-center justify-between w-full">
                    <div class="text-left">
                      <strong class="text-sm text-indigo-950 font-sans">Breathable Custom Linen Shirts</strong>
                      <p class="text-xs text-stone-500">Cool linen custom tailored sizes</p>
                    </div>
                    <span class="text-xs font-black font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">45,000 UGX</span>
                  </li>
                </ul>

                <div class="bg-indigo-50/55 p-4 rounded-xl text-center space-y-3">
                  <p class="text-xs text-indigo-800 flex items-center justify-center gap-1.5">
                    <svg class="icon icon-sm text-indigo-800 flex-shrink-0"><use href="#icon-location"/></svg>
                    <span>Wandegeya Market, Block A, Level 2, Kampala</span>
                  </p>
                  <a [routerLink]="['/contact']" [queryParams]="{ package: 'Fashion E-commerce Store Integration' }" class="w-full bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold py-3 rounded-lg block text-center transition-colors uppercase tracking-widest border-none">
                    Order Kampala Delivery (Interactive Quote)
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="p-8 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd] space-y-4">
            <h4 class="font-bold text-[#1f2b1d] uppercase tracking-tight font-sans">Project Summary</h4>
            <p class="text-xs sm:text-sm text-[#778575] leading-relaxed">
              This layout adopts high-end luxury editorial aesthetics. Dark rich overlays, neat hairline borders, and dynamic price blocks emphasize premium products while bypassing bulky script bundles.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <a [routerLink]="['/contact']" [queryParams]="{ package: 'Fashion Shop Package' }" class="bg-[#bf5d39] hover:bg-[#9e4624] text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl transition-all shadow-xs text-center border-none">
                Order Similar Layout
              </a>
            </div>
          </div>
        </div>
      } @else if (project()) {
        <!-- Dynamic Showcase Template -->
        <div class="space-y-8 text-left" [id]="'showcase-' + project()?.id">
          <div class="space-y-4">
            <span class="small-label text-accent-gold font-bold">DETAILED CASE STUDY</span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1f2b1d] uppercase tracking-tight font-sans">
              {{ project()?.name }}
            </h1>
            <p class="text-xs sm:text-sm text-[#778575] leading-relaxed max-w-3xl">
              {{ project()?.description }}
            </p>
          </div>

          <!-- Specs / Features -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd] space-y-4 text-left">
              <h3 class="text-sm font-bold border-b border-[#eae6dd] pb-2 text-[#1f2b1d] uppercase tracking-wider text-xs">Included Deliverables</h3>
              <ul class="space-y-3">
                @for (feat of project()?.features; track $index) {
                  <li class="flex items-start space-x-3 text-xs text-[#4d594b] font-sans">
                    <svg class="icon icon-sm text-accent-gold mt-0.5 flex-shrink-0 animate-pulse"><use href="#icon-check"/></svg>
                    <span>{{ feat }}</span>
                  </li>
                } @empty {
                  <li class="text-xs text-[#778575] font-mono">No specific features registered.</li>
                }
              </ul>
            </div>

            <div class="p-6 bg-[#bf5d39]/5 rounded-2xl border border-[#bf5d39]/15 flex flex-col justify-between text-left">
              <div class="space-y-2">
                <h3 class="text-sm font-bold border-b border-[#bf5d39]/10 pb-2 text-[#1f2b1d] uppercase tracking-wider text-xs">Implementation Stats</h3>
                <ul class="space-y-2 text-xs text-[#4d594b] font-mono">
                  <li>• Mobile Friendly Checklist: PASS</li>
                  <li>• Load Speed Rate Score: under 2.0s</li>
                  <li>• Accessible Touch Ratios: verified (48px+)</li>
                </ul>
              </div>
              
              <div class="pt-6">
                <a [href]="whatsappLink()" target="_blank" rel="noopener noreferrer" class="w-full bg-[#bf5d39] hover:bg-[#9e4624] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl block text-center transition-all shadow-xs border-none">
                  Request Custom Quote Like This
                </a>
              </div>
            </div>
          </div>

          <!-- Case Study details -->
          <div class="p-8 bg-[#fcfaf6] rounded-2xl border border-[#eae6dd] space-y-4">
            <h4 class="font-bold text-[#1f2b1d] uppercase tracking-tight">Technical Highlights</h4>
            <p class="text-xs sm:text-sm text-[#778575] leading-relaxed">
              This dynamic catalog interface operates fluidly on any portable scale. Fully integrated with clean modular styling rules, it avoids unindexed code weight to assure fast MTN and Airtel loading times cross-country.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              @if (project()?.demoUrl && !project()?.demoUrl?.startsWith('/portfolio')) {
                <a [href]="project()?.demoUrl" target="_blank" rel="noopener noreferrer" class="bg-primary-blue hover:bg-primary-blue-dark text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl text-center border-none">
                  View Live Store
                </a>
              }@else if (project() && project()?.id !== 'furniture-3d') {
                <a [routerLink]="[]" fragment="live-preview-box" class="bg-primary-blue hover:bg-primary-blue-dark text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl text-center border-none cursor-pointer">
                  See Live Interactive Mockup Below
                </a>
              }
              <a [routerLink]="['/contact']" [queryParams]="{ package: project()?.name + ' Showcase Layout' }" class="bg-transparent hover:bg-[#bf5d39]/5 text-[#bf5d39] border border-[#bf5d39] font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-xl text-center">
                Order Similar Layout
              </a>
            </div>
          </div>
        </div>
      } @else {
        <div class="p-12 text-center bg-[#fcfaf6] border border-[#eae6dd] rounded-2xl space-y-4">
          <p class="text-sm text-[#778575] font-sans">Case study parameters mismatch. Please query a valid project ID.</p>
          <a routerLink="/portfolio" class="btn-premium-primary text-[11px] tracking-wider uppercase inline-flex cursor-pointer animate-fade-in bg-primary-blue hover:bg-primary-blue-dark border-none">Back to Portfolio</a>
        </div>
      }

    </section>
  `,
  styles: [
    `
    .viewport-3d {
      perspective: 1000px;
      transform-style: preserve-3d;
    }
    .scene-3d-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
    }
    @media (max-width: 640px) {
      .scene-3d-wrapper {
        transform: scale(0.72);
      }
    }
    .scene-3d {
      position: relative;
      width: 240px;
      height: 240px;
      transform-style: preserve-3d;
    }
    .part-3d {
      position: absolute;
      transform-style: preserve-3d;
    }
    .face-3d {
      position: absolute;
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: inset 0 0 15px rgba(0,0,0,0.12);
      box-sizing: border-box;
    }
    `
  ]
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  dataState = inject(DataState);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  
  projectId = signal<string | null>(null);

  // 3D config variables
  cushionType = signal<string>('velvet-forest');
  woodType = signal<string>('mahogany-kampala');
  brassAccents = signal<boolean>(true);
  lightingScenario = signal<string>('golden');
  rotX = signal<number>(-12);
  rotY = signal<number>(35);
  autoSpin = signal<boolean>(true);

  // Drag interaction status variables
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private startRotX = 0;
  private startRotY = 0;
  private spinTimer: ReturnType<typeof setInterval> | null = null;
  private isBrowser = typeof window !== 'undefined';

  cushionMaterials = [
    { id: 'velvet-forest', name: 'Forest Velvet', price: 200000, base: '#1e351f', front: '#264227', back: '#132214', left: '#192c1a', right: '#192c1a', top: '#2d4f2e', text: 'Volcanic forest green velvet weave.' },
    { id: 'terracotta-clay', name: 'Terracotta Clay', price: 150000, base: '#bc5132', front: '#cf5b3a', back: '#8f3d25', left: '#a6482c', right: '#a6482c', top: '#df6541', text: 'Standard Ugandan clay brick hue.' },
    { id: 'leather-savannah', name: 'Savannah Leather', price: 450000, base: '#754522', front: '#8c5229', back: '#523018', left: '#663c1d', right: '#663c1d', top: '#9a5b2d', text: 'Genuine grass-fed tan leather.' },
    { id: 'midnight-kampala', name: 'Kampala Midnight', price: 0, base: '#1d2331', front: '#242c3d', back: '#11151d', left: '#191e2a', right: '#191e2a', top: '#2c354a', text: 'Classic heavy cotton dark canvas.' }
  ];

  woodTypes = [
    { id: 'mahogany-kampala', name: 'Kampala Mahogany', price: 250000, base: '#522114', front: '#5c2516', back: '#38160d', left: '#451c11', right: '#451c11', top: '#692a1a', text: 'Red-heart solid local mahogany.' },
    { id: 'oak-mabira', name: 'Mabira Oak', price: 100000, base: '#ad8c68', front: '#bfaa83', back: '#8c7050', left: '#9b7c5b', right: '#9b7c5b', top: '#cfb28c', text: 'Light honey oak timber grain.' },
    { id: 'ebony-espresso', name: 'Ebony Espresso', price: 350000, base: '#211c1a', front: '#292421', back: '#141110', left: '#1a1715', right: '#1a1715', top: '#3a322f', text: 'Dense ironwood with charcoal luster.' }
  ];

  activeCushion = computed(() => {
    const type = this.cushionType();
    return this.cushionMaterials.find(m => m.id === type) || this.cushionMaterials[0];
  });

  activeWood = computed(() => {
    const type = this.woodType();
    return this.woodTypes.find(w => w.id === type) || this.woodTypes[0];
  });

  totalPrice = computed(() => {
    const base = 1200000;
    const cushionExtra = this.activeCushion().price;
    const woodExtra = this.activeWood().price;
    const accentExtra = this.brassAccents() ? 100000 : 0;
    return base + cushionExtra + woodExtra + accentExtra;
  });

  getProjectIconId(id: string): string {
    const map: Record<string, string> = {
      'coffee': 'icon-coffee',
      'barber': 'icon-barber',
      'fashion': 'icon-fashion',
      'furniture-3d': 'icon-wrench'
    };
    return map[id] || 'icon-folder';
  }

  project = computed(() => {
    const id = this.projectId();
    if (!id) return null;
    return this.dataState.projects().find((p: Project) => p.id === id) || null;
  });

  whatsappLink = computed(() => {
    const raw = this.dataState.whatsappNumber();
    const clean = raw.replace(/\+/g, '').replace(/[^0-9]/g, '');
    return `https://wa.me/${clean}`;
  });

  getLightingGradient(): string {
    const scenario = this.lightingScenario();
    if (scenario === 'golden') {
      return 'radial-gradient(circle at center, #fff7eb 0%, #ecdcb9 100%)';
    } else if (scenario === 'studio') {
      return 'radial-gradient(circle at center, #ffffff 0%, #dbdae0 100%)';
    } else {
      return 'radial-gradient(circle at center, #2e2646 0%, #151121 100%)';
    }
  }

  formatUgx(amount: number): string {
    return new Intl.NumberFormat('en-UG', { maximumFractionDigits: 0 }).format(amount);
  }

  resetCamera() {
    this.rotY.set(35);
    this.rotX.set(-12);
    this.autoSpin.set(true);
  }

  // Camera dragging events
  onDragStart(event: MouseEvent) {
    this.isDragging = true;
    this.autoSpin.set(false);
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startRotX = this.rotX();
    this.startRotY = this.rotY();
    event.preventDefault();
  }

  onDragMove(event: MouseEvent) {
    if (!this.isDragging) return;
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;
    this.rotY.set(this.startRotY + dx * 0.5);
    this.rotX.set(Math.max(-45, Math.min(45, this.startRotX - dy * 0.5)));
  }

  onDragEnd() {
    this.isDragging = false;
  }

  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.isDragging = true;
      this.autoSpin.set(false);
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
      this.startRotX = this.rotX();
      this.startRotY = this.rotY();
    }
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging || event.touches.length !== 1) return;
    const dx = event.touches[0].clientX - this.startX;
    const dy = event.touches[0].clientY - this.startY;
    this.rotY.set(this.startRotY + dx * 0.5);
    this.rotX.set(Math.max(-45, Math.min(45, this.startRotX - dy * 0.5)));
  }

  compileWhatsAppOrder() {
    const phone = this.dataState.whatsappNumber().replace(/\+/g, '').replace(/[^0-9]/g, '');
    const text = `Hi Bilal! I configured a custom "Lugogo 3D Safari Lounge Chair" using your website's interactive 3D studio.

Configuration Details:
- Cushion Frame Style: ${this.activeCushion().name}
- Wood Material Choice: ${this.activeWood().name}
- Gold Studding Accents: ${this.brassAccents() ? 'Yes (Include Golden Studs)' : 'No'}
- Total Custom Price Quotation: UGX ${this.formatUgx(this.totalPrice())}

I would like to consult you regarding this premium 3D customizer feature!`;
    const encoded = encodeURIComponent(text);
    this.dataState.trackWhatsAppClick();
    this.dataState.logActivity('WhatsApp Order Compiled', `Inquired about Lugogo 3D armchair: ${this.activeCushion().name} cushion on ${this.activeWood().name}`);
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.projectId.set(id);

      // Update SEO settings dynamically depending on project id
      if (id === 'furniture-3d') {
        this.titleService.setTitle('Lugogo 3D Furniture Configurator Studio - Kampala | Bilal Web');
        this.metaService.updateTag({ name: 'description', content: 'Experience interactive 3D web configurators in Kampala. Customize upholstery, wood finish types, and see dynamic pricing in real-time.' });
        this.metaService.updateTag({ name: 'keywords', content: 'Lugogo furniture Kampala, 3D web design Uganda, 3D customizer Kampala, responsive web developer Uganda, interactive pricing calculator UGX' });
      } else {
        const found = this.dataState.projects().find(p => p.id === id);
        if (found) {
          this.titleService.setTitle(`${found.name} - Web Design Showcase Kampala | Bilal Web`);
          this.metaService.updateTag({ name: 'description', content: `${found.description || `Read about the case study for ${found.name} website designed in Kampala.`} Created to load fast on mobile cells in Uganda.` });
          this.metaService.updateTag({ name: 'keywords', content: `${found.name} Kampala, website showpiece Kampala, ${found.type} Uganda, Bilal Web customizer` });
        } else {
          this.titleService.setTitle('Creative Website Design Case Study Kampala | Bilal Web');
          this.metaService.updateTag({ name: 'description', content: 'Explore premium website developments crafted by Bilal Ahmed in Kampala, Uganda. High-speed, mobile-adapted configurations.' });
        }
      }
    });

    if (this.isBrowser) {
      this.spinTimer = setInterval(() => {
        if (this.autoSpin() && !this.isDragging) {
          this.rotY.update(y => (y + 0.6) % 360);
        }
      }, 35);
    }
  }

  ngOnDestroy() {
    if (this.spinTimer) {
      clearInterval(this.spinTimer);
    }
  }
}
