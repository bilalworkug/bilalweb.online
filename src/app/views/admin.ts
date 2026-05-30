import { ChangeDetectionStrategy, Component, inject, signal, effect, computed, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { DataState, Project, Package } from '../services/data';

export interface Inquiry {
  id: string;
  name: string;
  businessName: string;
  contactInfo: string;
  message: string;
  timestamp: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-admin',
  template: `
    <!-- MAIN DIALOG/TOAST ALERTS -->
    @if (toast(); as t) {
      <div class="fixed top-24 right-6 z-[100] transition-all duration-300 transform translate-y-0" id="admin-toast">
        <div [class]="t.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : t.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-blue-50 border border-blue-200 text-blue-700'" class="p-4 rounded-xl shadow-lg flex items-center space-x-2.5 font-sans font-bold text-xs">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <use [attr.href]="t.type === 'success' ? '#icon-check' : '#icon-alert'"/>
          </svg>
          <span>{{ t.message }}</span>
        </div>
      </div>
    }

    <!-- SHADOW CONFIRMATION MODAL -->
    @if (confirmTarget(); as c) {
      <div class="fixed inset-0 z-[90] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-xl border border-neutral-200 text-left">
          <div class="flex items-start space-x-3 text-red-600">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-alert"/></svg>
            <div>
              <h4 class="font-extrabold text-[#111] text-base">Confirm Action</h4>
              <p class="text-xs text-neutral-550 mt-1">Are you sure you want to delete {{ c.name }}? This cannot be undone.</p>
            </div>
          </div>
          <div class="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-100">
            <button (click)="confirmTarget.set(null)" class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold text-xs rounded-xl cursor-pointer">No (Cancel)</button>
            <button (click)="executeConfirmedAction(c)" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center space-x-1">
              <span>Yes (Delete)</span>
            </button>
          </div>
        </div>
      </div>
    }

    <div class="max-w-7xl mx-auto py-4 px-2 sm:px-4" id="admin-viewport">
      @if (!isLoggedIn()) {
        <!-- LOGIN STAGE CARD -->
        <div class="max-w-md mx-auto bg-[#fcfaf6] border border-[#bf5d39]/10 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6 text-center mt-8 cursor-default select-none animate-slide-up" [class.animate-shake]="shakeError()" id="login-container">
          <div class="space-y-2">
            <span class="text-3xl font-black text-[#bf5d39] block tracking-tight font-sans">Bilal Web</span>
            <h1 class="text-xl font-bold text-[#1f2b1d] tracking-tight font-serif uppercase">Admin Login</h1>
            <p class="text-xs text-[#778575] font-sans">Manage your website and business showcases</p>
          </div>

          @if (loginLocked()) {
            <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-bold text-left space-y-1">
              <p>⚠️ Too many failed arguments, login locked!</p>
              <p class="font-mono text-[10px] text-red-600">Safe countdown lockout active: <span class="font-bold underline">{{ lockTimer() }} seconds</span></p>
            </div>
          } @else {
            <form (submit)="handleLogin($event)" class="text-left space-y-4">
              @if (loginError()) {
                <div class="bg-red-50 border border-red-200 text-red-750 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2" id="login-error">
                  <svg class="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-alert"/></svg>
                  <span>{{ loginError() }}</span>
                </div>
              }

              <div class="space-y-1.5">
                <label for="login-email" class="block text-xs font-bold uppercase tracking-wider text-[#778575] font-mono">Admin Email Address</label>
                <input 
                  type="email" 
                  id="login-email" 
                  [formControl]="loginEmail" 
                  placeholder="e.g. bilal@bilalweb.online" 
                  class="w-full px-4 py-2.5 border border-[#eae6dd] rounded-xl focus:ring-2 focus:ring-[#bf5d39]/20 focus:border-[#bf5d39] outline-none text-sm text-neutral-800 bg-white font-sans"
                />
              </div>

              <div class="space-y-1.5 relative">
                <label for="login-password" class="block text-xs font-bold uppercase tracking-wider text-[#778575] font-mono">Secret key Password</label>
                <div class="relative">
                  <input 
                    [type]="passwordVisible() ? 'text' : 'password'" 
                    id="login-password" 
                    [formControl]="loginPassword" 
                    placeholder="Enter password..." 
                    class="w-full px-4 py-2.5 border border-[#eae6dd] rounded-xl focus:ring-2 focus:ring-[#bf5d39]/20 focus:border-[#bf5d39] outline-none text-sm text-neutral-800 bg-white pr-10 font-sans"
                  />
                  <!-- eye icon toggle -->
                  <button type="button" (click)="passwordVisible.set(!passwordVisible())" class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#1f2b1d]" aria-label="Toggle password text display">
                    <svg class="w-4 h-4 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      @if (passwordVisible()) {
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
                      } @else {
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      }
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <input type="checkbox" id="rem-me" [formControl]="rememberMe" class="w-4 h-4 text-[#bf5d39] accent-[#bf5d39] border-stone-300 rounded focus:ring-[#bf5d39]"/>
                <label for="rem-me" class="text-xs text-[#4d594b] font-medium font-sans select-none cursor-pointer">Remember Me on this browser</label>
              </div>

              <button 
                type="submit" 
                class="w-full py-3 bg-[#bf5d39] hover:bg-[#9e4624] text-white font-bold rounded-xl shadow-xs transition-colors text-xs flex items-center justify-center space-x-2 cursor-pointer active:scale-98 border-none"
              >
                <span>Login Securely</span>
              </button>
            </form>
          }

          <div class="text-[10px] font-mono text-neutral-450 border-t border-neutral-100 pt-4">
            Authorized Personnel only. Active tracking enabled.
          </div>
        </div>
      } @else {
        <!-- DASHBOARD ROOT LAYOUT COLLABORATOR -->
        <div class="flex flex-col md:flex-row min-h-[75vh] bg-[#fdfbf7] border border-[#eae6dd] rounded-2xl overflow-hidden shadow-sm relative font-sans">
          
          <!-- SIDEBAR: DESKTOP PANEL -->
          <aside class="hidden md:flex w-64 bg-[#4e6049] text-white flex-col justify-between p-6 shrink-0 text-left border-r border-[#eae6dd]/10">
            <div class="space-y-6">
              <div class="space-y-1">
                <h3 class="text-xl font-serif font-black text-[#faf8f4] tracking-tight uppercase">Bilal Web</h3>
                <span class="text-[9px] text-[#eae6dd]/60 font-mono font-bold uppercase tracking-widest block">Admin Control Center</span>
              </div>

              <nav class="space-y-1.5">
                @for (tab of ['overview', 'inbox', 'portfolio', 'packages', 'settings']; track tab) {
                  <button 
                    (click)="activeTab.set(tab)"
                    [class]="activeTab() === tab ? 'bg-white/10 text-white border-l-4 border-[#bf5d39] pl-3' : 'text-[#eae6dd]/85 hover:text-white pl-4 hover:bg-white/5'"
                    class="w-full text-left py-2.5 rounded-r-lg transition-all text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2.5 cursor-pointer relative"
                  >
                    <svg class="w-4 h-4 text-current shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <use [attr.href]="'#' + getTabIconId(tab)"/>
                    </svg>
                    <span>{{ tab === 'overview' ? 'Overview' : tab === 'inbox' ? 'Inquiries Inbox' : tab === 'portfolio' ? 'Portfolio' : tab === 'packages' ? 'Packages & Pricing' : 'Global Settings' }}</span>
                    @if (tab === 'inbox' && inquiriesList().length > 0) {
                      <span class="absolute right-3 top-3 flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bf5d39] opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-[#bf5d39]"></span>
                      </span>
                    }
                  </button>
                }
              </nav>
            </div>

            <button (click)="handleLogout()" class="w-full text-left py-2.5 pl-4 text-rose-200 hover:text-white hover:bg-white/5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2.5 transition-all cursor-pointer">
              <svg class="w-4 h-4 rotate-180 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Logout Admin</span>
            </button>
          </aside>

          <!-- TOP NAVIGATION BAR & BREADCRUMBS -->
          <div class="flex-1 flex flex-col min-w-0 bg-[#faf8f4]">
            <header class="bg-white border-b border-[#eae6dd] px-6 py-4 flex items-center justify-between">
              
              <div class="flex items-center space-x-2">
                <button (click)="mobileMenuOpen.set(!mobileMenuOpen())" class="md:hidden p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-700" aria-label="Open sidebar drawer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-menu"/></svg>
                </button>
                
                <span class="text-[10px] font-mono font-bold text-[#778575] uppercase tracking-widest hidden sm:inline">Admin Panel</span>
                <span class="text-[#eae6dd] hidden sm:inline">&gt;</span>
                <span class="text-xs font-mono font-bold text-[#1f2b1d] uppercase tracking-wider">
                  {{ activeTab() }} view
                </span>
              </div>

              <div class="flex items-center space-x-4">
                <button (click)="handleNotificationsClick()" class="p-1.5 text-neutral-400 hover:text-neutral-700 relative cursor-pointer" aria-label="Notifications" title="View system diagnostics notifications">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#bf5d39] animate-pulse"></span>
                </button>

                <div class="flex items-center space-x-2 border-l border-[#eae6dd] pl-4 select-none">
                  <div class="w-8 h-8 rounded-full bg-[#bf5d39] text-white flex items-center justify-center font-black text-xs uppercase ring-2 ring-[#bf5d39]/10">
                    {{ dataState.displayName().charAt(0) }}
                  </div>
                  <span class="text-xs font-extrabold text-[#1f2b1d] hidden md:inline">{{ dataState.displayName() }}</span>
                </div>
              </div>
            </header>

            <!-- PORTABLE DRAWER OVERLAY ON MOBILE -->
            @if (mobileMenuOpen()) {
              <div class="fixed inset-0 z-40 bg-black/50 md:hidden" (click)="mobileMenuOpen.set(false)" (keydown.enter)="mobileMenuOpen.set(false)" role="button" tabindex="0" aria-label="Close sidebar panel overlay"></div>
              <div class="fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#4e6049] text-white p-6 shadow-2xl flex flex-col justify-between md:hidden text-left">
                <div class="space-y-6">
                  <div class="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 class="text-lg font-serif font-black text-[#faf8f4] uppercase select-none">Bilal Web</h3>
                      <p class="text-[9px] text-[#eae6dd]/60 font-mono">Mobile Navigation Console</p>
                    </div>
                    <button (click)="mobileMenuOpen.set(false)" class="text-neutral-400 hover:text-white p-1" aria-label="Close sidebar panel">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><use href="#icon-close"/></svg>
                    </button>
                  </div>
                  <nav class="space-y-1.5">
                    @for (tab of ['overview', 'inbox', 'portfolio', 'packages', 'settings']; track tab) {
                      <button 
                        (click)="activeTab.set(tab); mobileMenuOpen.set(false);"
                        [class]="activeTab() === tab ? 'bg-white/10 text-white border-l-4 border-[#bf5d39] pl-3' : 'text-[#eae6dd]/85 hover:text-white pl-4'"
                        class="w-full text-left py-3 rounded-r-lg transition-all text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-3 cursor-pointer relative"
                      >
                        <svg class="w-4 h-4 text-current shadow-xs" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <use [attr.href]="'#' + getTabIconId(tab)"/>
                        </svg>
                        <span>{{ tab === 'overview' ? 'Overview' : tab === 'inbox' ? 'Inquiries Inbox' : tab === 'portfolio' ? 'Portfolio' : tab === 'packages' ? 'Packages & Pricing' : 'Settings' }}</span>
                        @if (tab === 'inbox' && inquiriesList().length > 0) {
                          <span class="absolute right-3 top-3.5 flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bf5d39] opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-[#bf5d39]"></span>
                          </span>
                        }
                      </button>
                    }
                  </nav>
                </div>
                <button (click)="handleLogout(); mobileMenuOpen.set(false);" class="w-full text-left py-3 pl-4 text-rose-200 hover:text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-3 transition-colors cursor-pointer">
                  <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Logout Admin</span>
                </button>
              </div>
            }

            <!-- PRIMARY WORKING VIEWS PANEL -->
            <main class="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto space-y-8">

              <!-- TAB 1: OVERVIEW -->
              @if (activeTab() === 'overview') {
                <div class="space-y-8 text-left animate-slide-up font-sans">
                  
                  <div class="bg-[#fcfaf6] border border-[#bf5d39]/15 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
                    <div class="space-y-1">
                      <h2 class="text-xl sm:text-2xl font-serif font-black text-[#1f2b1d] tracking-tight">Welcome back, {{ dataState.displayName() }}</h2>
                      <p class="text-xs text-[#778575] font-sans">Business management dashboard: monitor portfolio showcases and pricing cards instantly from Kampala support desk.</p>
                    </div>
                    <div class="text-[10px] font-mono font-bold bg-[#bf5d39]/5 text-[#bf5d39] px-3.5 py-2 rounded-xl border border-[#bf5d39]/15 shrink-0 self-start sm:self-auto select-none uppercase tracking-wider">
                      📅 {{ todayString }}
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-white border border-[#eae6dd] p-6 rounded-2xl flex items-center space-x-4 shadow-[0_2px_10px_rgba(31,43,29,0.02)] hover:shadow-md transition-shadow">
                      <div class="w-12 h-12 rounded-xl bg-[#bf5d39]/5 text-[#bf5d39] flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-folder"/></svg>
                      </div>
                      <div>
                        <span class="text-[9px] font-bold text-[#778575] uppercase font-mono tracking-wider block">Total Projects</span>
                        <span class="text-lg font-black text-[#1f2b1d] font-sans">{{ dataState.projects().length }} listed</span>
                      </div>
                    </div>

                    <div class="bg-white border border-[#eae6dd] p-6 rounded-2xl flex items-center space-x-4 shadow-[0_2px_10px_rgba(31,43,29,0.02)] hover:shadow-md transition-shadow">
                      <div class="w-12 h-12 rounded-xl bg-[#4e6049]/5 text-[#4e6049] flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-package"/></svg>
                      </div>
                      <div>
                        <span class="text-[9px] font-bold text-[#778575] uppercase font-mono tracking-wider block">Active Packages</span>
                        <span class="text-lg font-black text-[#1f2b1d] font-sans">{{ getActivePackagesCount() }} tiers</span>
                      </div>
                    </div>

                    <div class="bg-white border border-[#eae6dd] p-6 rounded-2xl flex items-center space-x-4 shadow-[0_2px_10px_rgba(31,43,29,0.02)] hover:shadow-md transition-shadow">
                      <div class="w-12 h-12 rounded-xl bg-[#bf5d39]/5 text-[#bf5d39] flex items-center justify-center flex-shrink-0 relative">
                        <svg class="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-whatsapp"/></svg>
                      </div>
                      <div>
                        <span class="text-[9px] font-bold text-[#778575] uppercase tracking-wider font-mono block">WhatsApp Clicks</span>
                        <span class="text-lg font-black text-[#1f2b1d] font-mono">{{ dataState.whatsappClicks() }} interactions</span>
                      </div>
                    </div>

                    <div class="bg-white border border-[#eae6dd] p-6 rounded-2xl flex items-center space-x-4 shadow-[0_2px_10px_rgba(31,43,29,0.02)] hover:shadow-md transition-shadow">
                      <div class="w-12 h-12 rounded-xl bg-[#4e6049]/5 text-[#4e6049] flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <span class="text-[9px] font-bold text-[#778575] uppercase tracking-wider font-mono block">Last Update</span>
                        <span class="text-xs font-mono text-[#1f2b1d] line-clamp-1 truncate" [title]="lastUpdatedDate()">{{ lastUpdatedDate() }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                    <div class="lg:col-span-4 bg-white border border-[#eae6dd] p-6 sm:p-8 rounded-2xl space-y-6 shadow-[0_2px_10px_rgba(31,43,29,0.01)]">
                      <h4 class="font-extrabold text-[#1f2b1d] font-mono text-[10px] uppercase tracking-widest border-b border-[#eae6dd] pb-3">Quick Commands</h4>
                      <div class="flex flex-col gap-3">
                        <button (click)="openAddProject(); activeTab.set('portfolio');" class="bg-[#4e6049] hover:bg-[#3e4f3a] text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer text-left border-none">
                          <span>+ Add New Project</span>
                        </button>
                        <button (click)="openAddPackage(); activeTab.set('packages');" class="bg-[#bf5d39] hover:bg-[#9e4624] text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer text-left border-none">
                          <span>+ Add New Package</span>
                        </button>
                        <a routerLink="/" target="_blank" class="border border-[#eae6dd] bg-[#faf8f4] hover:bg-white text-[#4d594b] font-extrabold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors text-center shadow-xs no-underline">
                          <svg class="w-4.5 h-4.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-link"/></svg>
                          <span>Open Live Website</span>
                        </a>
                      </div>
                    </div>

                    <div class="lg:col-span-8 bg-white border border-[#eae6dd] p-6 sm:p-8 rounded-2xl space-y-6 shadow-[0_2px_10px_rgba(31,43,29,0.01)]">
                      <h4 class="font-extrabold text-[#1f2b1d] font-mono text-[10px] uppercase tracking-widest border-b border-[#eae6dd] pb-3">Recent Live Activity Logs</h4>
                      <div class="space-y-4 max-h-[250px] overflow-y-auto pr-1">
                        @for (act of dataState.activityFeed(); track act.timestamp) {
                          <div class="flex items-start justify-between space-x-4 bg-[#faf9f6]/45 p-4 rounded-xl border border-[#eae6dd]/80 hover:border-[#bf5d39]/30 transition-all">
                            <div class="space-y-1 text-left">
                              <span class="inline-block bg-[#bf5d39]/5 text-[#bf5d39] text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#bf5d39]/10">{{ act.action }}</span>
                              <p class="text-xs text-[#1f2b1d] font-medium leading-relaxed">{{ act.details }}</p>
                            </div>
                            <span class="text-[9px] font-mono font-bold text-[#778575] shrink-0">{{ formatShortTime(act.timestamp) }}</span>
                          </div>
                        } @empty {
                          <div class="text-center py-10 text-xs text-[#778575] font-mono">
                            No modifications logged yet on this computer.
                          </div>
                        }
                      </div>
                    </div>
                  </div>

                  <!-- SECTION: NEWSLETTER SIGNUPS -->
                  <div class="bg-white border border-[#eae6dd] p-6 sm:p-8 rounded-2xl text-left space-y-6 shadow-[0_2px_10px_rgba(31,43,29,0.01)]">
                    <div class="flex items-center justify-between border-b border-[#eae6dd] pb-4">
                      <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 rounded-xl bg-[#bf5d39]/5 text-[#bf5d39] flex items-center justify-center">
                          <svg class="w-4 h-4 text-[#bf5d39]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                        </div>
                        <h4 class="font-extrabold text-[#1f2b1d] font-mono text-[10px] uppercase tracking-widest">Newsletter Subscribers Mailing List</h4>
                      </div>
                      <span class="text-[9px] font-bold font-mono tracking-wider bg-[#5c7257]/10 text-[#4e6049] px-2.5 py-1 rounded-xl">
                        {{ dataState.newsletterSubscribers().length }} registered
                      </span>
                    </div>

                    <div class="overflow-hidden border border-[#eae6dd]/80 rounded-xl bg-white shadow-xs">
                      <div class="max-h-[240px] overflow-y-auto pr-1">
                        <table class="w-full text-xs text-left text-[#1f2b1d] font-sans">
                          <thead class="bg-[#fdfbf9] text-[9px] font-mono font-bold uppercase tracking-wider text-[#778575] border-b border-[#eae6dd] select-none">
                            <tr>
                              <th class="px-5 py-3">Subscriber Email</th>
                              <th class="px-5 py-3">Date Subscribed</th>
                              <th class="px-5 py-3 text-right">Settings</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-[#eae6dd]/50">
                            @for (sub of dataState.newsletterSubscribers(); track sub.email) {
                              <tr class="hover:bg-[#faf8f4] transition-colors">
                                <td class="px-5 py-3 font-semibold text-[#1f2b1d] select-all">{{ sub.email }}</td>
                                <td class="px-5 py-3 font-mono text-[10px] text-[#778575]">{{ formatShortTime(sub.dateSubscribed) }}</td>
                                <td class="px-5 py-3 text-right">
                                  <button (click)="removeSubscriber(sub.email)" class="text-rose-600 hover:text-rose-800 font-extrabold font-mono text-[9px] uppercase tracking-wider cursor-pointer bg-transparent border-none active:scale-95 transition-transform focus:outline-none">
                                    [Erase recipient]
                                  </button>
                                </td>
                              </tr>
                            } @empty {
                              <tr>
                                <td colspan="3" class="text-center py-12 text-xs text-[#778575] font-mono bg-[#faf9f6]/40">
                                  No client emails registered in subscription pool yet.
                                </td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                </div>
              }

              <!-- TAB: CLIENT INBOX INQUIRIES -->
              @if (activeTab() === 'inbox') {
                <div class="space-y-8 text-left animate-slide-up font-sans">
                  
                  <div class="bg-white border border-[#bf5d39]/20 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden shadow-[0_2px_10px_rgba(191,93,57,0.02)]">
                    <div class="space-y-1">
                      <div class="inline-flex items-center space-x-2 py-0.5 px-2 bg-[#bf5d39]/10 text-[#bf5d39] text-[9px] font-mono font-bold uppercase tracking-widest rounded-md">
                        <span>Live Inbox Channel</span>
                      </div>
                      <h2 class="text-xl sm:text-2xl font-serif font-black text-[#1f2b1d] tracking-tight">Client Contact Inquiries</h2>
                      <p class="text-xs text-[#778575]">Track, manage and review accurate client specifications submitted from Bilal Web Contact Form or Quote checkout streams.</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-3 self-start sm:self-auto shrink-0 select-none">
                      @if (inquiriesList().length > 0) {
                        <button (click)="exportToCSV()" class="inline-flex items-center space-x-1.5 text-xs font-bold font-mono uppercase bg-[#bf5d39] hover:bg-[#a64e2e] text-white px-4 py-2.5 rounded-xl border-none cursor-pointer shadow-xs active:scale-95 transition-all">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                          </svg>
                          <span>Export to CSV</span>
                        </button>
                      }
                      <button (click)="fetchInquiries()" class="inline-flex items-center space-x-1.5 text-xs font-bold font-mono uppercase bg-[#4e6049] hover:bg-[#3e4f3a] text-white px-4 py-2.5 rounded-xl border-none cursor-pointer shadow-xs active:scale-95 transition-all">
                        @if (isLoadingInquiries()) {
                          <svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1 1 21.306 7"/></svg>
                        } @else {
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1 1 21.306 7"/></svg>
                        }
                        <span>Refresh Inbox</span>
                      </button>
                    </div>
                  </div>

                  @if (isLoadingInquiries()) {
                    <div class="text-center py-20 space-y-4 bg-white border border-[#eae6dd] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                      <div class="inline-block w-8 h-8 rounded-full border-4 border-[#bf5d39]/30 border-t-[#bf5d39] animate-spin"></div>
                      <p class="text-xs font-mono text-[#778575] uppercase tracking-wider">Syncing secure client specs...</p>
                    </div>
                  } @else {
                    <div class="grid grid-cols-1 gap-8">
                      @for (inq of inquiriesList(); track inq.id) {
                        <div class="bg-white border border-[#eae6dd] rounded-2xl p-7 sm:p-9 space-y-7 shadow-[0_4px_15px_rgba(0,0,0,0.02)] relative hover:border-[#bf5d39]/35 transition-all">
                          <!-- Floating top corner actions -->
                          <div class="absolute top-6 right-6 flex items-center space-x-2">
                            <span class="text-[9.5px] font-mono font-bold text-[#778575] bg-neutral-100 px-2 py-1 rounded-md border border-neutral-200">
                              {{ formatInquiryTime(inq.timestamp) }}
                            </span>
                            <button (click)="deleteInquiry(inq.id)" class="text-rose-600 hover:text-white hover:bg-rose-600 px-2.5 py-1.5 border border-rose-300 hover:border-transparent rounded-lg font-mono text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer">
                              Delete
                            </button>
                          </div>

                          <div class="space-y-4">
                            <!-- Sender profile header -->
                            <div class="space-y-1.5 max-w-[70%] sm:max-w-[80%] pr-4">
                              <span class="text-[9px] font-mono font-bold uppercase tracking-widest text-[#bf5d39]">Inquiry ID: {{ inq.id }}</span>
                              <h3 class="text-lg font-bold text-[#1f2b1d] uppercase tracking-tight flex flex-wrap items-center gap-1.5 sm:gap-2 select-all">
                                <span>{{ inq.name }}</span>
                                @if (inq.businessName && inq.businessName !== 'N/A') {
                                  <span class="hidden sm:inline text-neutral-300 font-normal">|</span>
                                  <span class="text-xs sm:text-sm font-medium text-[#778575] normal-case bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200 select-text">{{ inq.businessName }}</span>
                                }
                              </h3>
                              
                              <div class="flex items-center space-x-1.5 text-xs text-[#5c7257] select-all font-mono">
                                <strong class="bg-[#5c7257]/10 text-[#4e6049] px-1.5 py-0.5 rounded font-bold">Contact:</strong>
                                <span class="font-bold underline">{{ inq.contactInfo }}</span>
                              </div>
                            </div>

                            <hr class="border-[#eae6dd]/80" />

                            <!-- Specification message content -->
                            <div class="space-y-2 text-left">
                              <span class="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-450 block">Technical Scope / Project Request:</span>
                              <div class="bg-white border border-[#eae6dd]/75 p-4 rounded-xl text-xs sm:text-sm text-neutral-800 leading-relaxed font-sans whitespace-pre-wrap select-all font-medium border-l-4 border-l-[#bf5d39]">
                                {{ inq.message }}
                              </div>
                            </div>

                            <!-- Mobile Quick follow-up action tools -->
                            <div class="flex flex-wrap gap-3 pt-2 select-none">
                              <a [href]="'https://wa.me/' + cleanNumber(inq.contactInfo)" target="_blank" class="bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold text-[10px] tracking-wider uppercase py-2.5 px-4 rounded-xl inline-flex items-center space-x-2 transition-all no-underline">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><use href="#icon-whatsapp"/></svg>
                                <span>Follow up on WhatsApp</span>
                              </a>
                              <a [href]="'mailto:' + inq.contactInfo" class="border border-[#eae6dd] bg-white hover:bg-[#faf9f5] text-[#4d594b] font-bold text-[10px] tracking-wider uppercase py-2.5 px-4 rounded-xl inline-flex items-center space-x-1.5 transition-colors no-underline">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <span>Send E-mail</span>
                              </a>
                            </div>

                          </div>
                        </div>
                      } @empty {
                        <div class="bg-[#fcfaf6] border border-[#eae6dd] rounded-2xl p-16 text-center space-y-4">
                          <svg class="w-12 h-12 text-[#bf5d39]/20 mx-auto" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24">
                            <use href="#icon-email"/>
                          </svg>
                          <div class="space-y-1">
                            <h4 class="text-sm font-bold uppercase text-[#1f2b1d]">Your Inbox is Empty</h4>
                            <p class="text-xs text-[#778575] max-w-sm mx-auto leading-relaxed">No custom customer specifications or contact drafts submitted yet. New items will appear live instantly.</p>
                          </div>
                        </div>
                      }
                    </div>
                  }

                </div>
              }

              <!-- TAB 2: PORTFOLIO -->
              @if (activeTab() === 'portfolio') {
                <div class="space-y-6 text-left">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eae6dd] pb-4">
                    <div>
                      <h2 class="text-lg font-black text-[#1f2b1d] font-serif uppercase tracking-tight">Portfolio Showcase Projects</h2>
                      <p class="text-xs text-[#778575]">Enable, adjust, and showcase mockups represented on the public domain.</p>
                    </div>
                    <button (click)="openAddProject()" class="bg-[#bf5d39] hover:bg-[#9e4624] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-sm select-none shrink-0 self-start sm:self-auto border-none">
                      <span>+ Add New Project</span>
                    </button>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white border border-[#eae6dd] p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                    <div class="relative flex-1">
                      <input 
                        type="text" 
                        placeholder="Search projects by name or type..." 
                        [formControl]="portfolioSearchQuery"
                        class="w-full pl-10 pr-4 py-3 border border-[#eae6dd] rounded-xl text-xs text-[#1f2b1d] outline-none focus:border-[#bf5d39] focus:ring-1 focus:ring-[#bf5d39]/20 bg-white"
                      />
                      <svg class="w-4 h-4 text-[#778575] absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="flex items-center space-x-2 shrink-0">
                      <label for="sort-proj" class="text-[10px] font-bold uppercase tracking-wider text-[#778575] font-mono">Sort Matrix:</label>
                      <select id="sort-proj" (change)="handleProjectSortChange($event)" class="border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-700 bg-white cursor-pointer outline-none">
                        <option value="name">Alphabetical Name</option>
                        <option value="date">Date Added (Newest)</option>
                      </select>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    @for (proj of filteredProjects(); track proj.id) {
                      <div class="bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between" [class.border-neutral-200]="proj.visible !== false" [class.border-red-250]="proj.visible === false" [style.opacity]="proj.visible === false ? '0.75' : '1'">
                        <div>
                          <!-- Full Bleed Image Cover for premium airy appeal -->
                          <div class="relative w-full aspect-[22/10] bg-[#faf9f6]/95 border-b border-neutral-150 flex items-center justify-center overflow-hidden select-none">
                            @if (proj.image) {
                              <img [src]="proj.image" alt="Project Card Cover" class="w-full h-full object-cover" referrerpolicy="no-referrer"/>
                            } @else {
                              <div class="flex flex-col items-center justify-center space-y-1">
                                <svg class="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747" />
                                </svg>
                                <span class="text-[9px] font-mono text-neutral-400 font-bold uppercase">No Custom Image</span>
                              </div>
                            }
                          </div>

                          <div class="p-6 space-y-5">
                            <div class="flex items-start justify-between space-x-3">
                              <div class="min-w-0 text-left">
                                <h4 class="text-sm font-extrabold text-neutral-905 truncate" [title]="proj.name">{{ proj.name }}</h4>
                                <span class="bg-[#bf5d39]/5 text-[#bf5d39] border border-[#bf5d39]/10 rounded-md px-2 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wider inline-block mt-1.5 truncate max-w-full" [title]="proj.businessType || proj.type">
                                  {{ proj.businessType || proj.type }}
                                </span>
                              </div>

                              <div class="flex flex-col items-end shrink-0 select-none">
                                <label [for]="'status-proj-' + proj.id" class="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    [id]="'status-proj-' + proj.id"
                                    [checked]="proj.visible !== false" 
                                    (change)="toggleProjectVisibility(proj.id, proj.visible)"
                                    class="sr-only peer"
                                    aria-label="Toggle project visibility"
                                  />
                                  <div class="w-8 h-4 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-blue"></div>
                                </label>
                                <span class="text-[8px] font-bold uppercase tracking-wider block mt-1" [class.text-primary-blue]="proj.visible !== false" [class.text-neutral-400]="proj.visible === false">
                                  {{ proj.visible !== false ? 'Visible' : 'Hidden' }}
                                </span>
                              </div>
                            </div>

                            <!-- Live Demo URL display -->
                            <div class="text-[10px] font-mono bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-150 flex items-center justify-between select-all truncate text-left">
                              <span class="text-neutral-500 font-bold">Demo URL:</span>
                              <span class="text-neutral-700 truncate inline-block max-w-[170px]" [title]="proj.demoUrl">{{ proj.demoUrl }}</span>
                            </div>

                            <p class="text-xs text-neutral-550 leading-relaxed font-sans line-clamp-3 text-left">
                              {{ proj.description || 'No custom description defined.' }}
                            </p>

                            @if (proj.features && proj.features.length > 0) {
                              <div class="flex flex-wrap gap-1.5 pt-1">
                                @for (feat of proj.features; track $index) {
                                  <span class="bg-neutral-50 border border-neutral-200 text-neutral-600 text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                                    <svg class="w-2.5 h-2.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><use href="#icon-check"/></svg>
                                    <span class="truncate max-w-[120px]">{{ feat }}</span>
                                  </span>
                                }
                              </div>
                            }
                          </div>
                        </div>

                        <div class="bg-neutral-50 px-5 py-3 border-t border-neutral-150 flex items-center justify-between">
                          <a [href]="proj.demoUrl" target="_blank" class="hover:text-primary-blue inline-flex items-center space-x-1 text-xs font-bold text-neutral-500">
                            <svg class="w-3.5 h-3.5 text-neutral-600" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            <span>Live Site</span>
                          </a>

                          <div class="flex space-x-1.5">
                            <button (click)="openEditProject(proj)" class="p-1.5 hover:bg-neutral-200 hover:text-neutral-900 rounded-lg text-neutral-500 transition-colors cursor-pointer" title="Edit attributes">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/>
                              </svg>
                            </button>
                            <button (click)="openDeleteConfirm(proj.id, proj.name, 'project')" class="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-neutral-400 transition-colors cursor-pointer" title="Delete showcase">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    } @empty {
                      <div class="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-dashed border-neutral-300 py-16 text-center rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
                        <svg class="w-16 h-16 text-neutral-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><use href="#icon-folder"/></svg>
                        <div class="space-y-1">
                          <h4 class="font-extrabold text-neutral-800">No projects yet defined</h4>
                          <p class="text-xs text-neutral-550 max-w-sm mx-auto">Add your first custom showcase layout using the button above to visually impress visitors on the public /portfolio route.</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- TAB 3: PACKAGES -->
              @if (activeTab() === 'packages') {
                <div class="space-y-6 text-left">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
                    <div>
                      <h2 class="text-lg font-black text-neutral-900 font-serif">Pricing Packages</h2>
                      <p class="text-xs text-neutral-500 font-sans">Control pricing models, timelines, indicators, and details visible on /services.</p>
                    </div>
                    <button (click)="openAddPackage()" class="bg-primary-blue hover:bg-[#0d47a1]/95 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shrink-0 self-start sm:self-auto">
                      <span>+ Add New Package</span>
                    </button>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white border border-[#eae6dd] p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                    <div class="relative flex-1">
                      <input 
                        type="text" 
                        placeholder="Search pricing tiers by name or feature text..." 
                        [formControl]="packagesSearchQuery"
                        class="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl text-xs text-neutral-800 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue/30"
                      />
                      <svg class="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="flex items-center space-x-2 shrink-0">
                      <label for="sort-pkg" class="text-[10px] font-bold uppercase tracking-wider text-[#778575] font-mono">Order By:</label>
                      <select id="sort-pkg" (change)="handlePackageSortChange($event)" class="border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-700 bg-white cursor-pointer outline-none">
                        <option value="name">Package Name</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    @for (pkg of filteredPackages(); track pkg.id) {
                      <div class="bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between" [class.border-neutral-200]="pkg.active !== false" [class.border-red-250]="pkg.active === false" [style.opacity]="pkg.active === false ? '0.75' : '1'">
                        <div class="p-6 sm:p-7 space-y-6 relative">
                          @if (pkg.mostPopular) {
                            <div class="absolute top-5 right-14 bg-amber-100 text-[#f9a825] border border-amber-300 rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest flex items-center space-x-1 select-none">
                              <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-star"/></svg>
                              <span>Popular</span>
                            </div>
                          }

                          <div class="flex items-start justify-between space-x-2">
                            <div class="flex items-center space-x-2.5">
                              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-[#f9a825] flex items-center justify-center border border-amber-200 flex-shrink-0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8"><use [attr.href]="'#' + (pkg.icon || 'icon-package')"/></svg>
                              </div>
                              <div class="min-w-0 text-left">
                                <h4 class="font-extrabold text-neutral-900 truncate" [title]="pkg.name">{{ pkg.name }}</h4>
                                <span class="bg-[#4e6049]/5 text-[#4e6049] border border-[#4e6049]/10 rounded-md px-2 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wider inline-block mt-1 leading-tight">Delivery: {{ pkg.delivery }}</span>
                              </div>
                            </div>

                            <div class="flex flex-col items-end shrink-0 select-none">
                              <label [for]="'status-pkg-' + pkg.id" class="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  [id]="'status-pkg-' + pkg.id"
                                  [checked]="pkg.active !== false" 
                                  (change)="togglePackageStatus(pkg.id, pkg.active)"
                                  class="sr-only peer"
                                  aria-label="Toggle package status"
                                />
                                <div class="w-8 h-4 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-blue"></div>
                              </label>
                              <span class="text-[8px] font-bold uppercase tracking-wider block mt-1" [class.text-primary-blue]="pkg.active !== false" [class.text-neutral-400]="pkg.active === false">
                                {{ pkg.active !== false ? 'Active' : 'Inactive' }}
                              </span>
                            </div>
                          </div>

                          <div class="space-y-0.5 border-y border-neutral-100 py-3 text-left">
                            <span class="text-[9px] uppercase font-bold text-neutral-400 font-mono tracking-wider">Service Investment Price</span>
                            <p class="text-xl font-black text-primary-blue font-mono">
                              {{ formatUgx(pkg.price) }} <span class="text-xs text-neutral-400 font-normal">UGX</span>
                            </p>
                          </div>

                          <p class="text-xs text-neutral-550 leading-relaxed font-sans line-clamp-3 text-left">
                            {{ pkg.description || 'No custom details defined.' }}
                          </p>

                          @if (pkg.freeDomainHosting) {
                            <div class="bg-emerald-50 border border-emerald-150 text-emerald-800 text-[9px] font-bold py-1 px-3 rounded-xl flex items-center space-x-1.5 w-max select-none">
                              <svg class="w-3 h-3 text-emerald-700 font-bold" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><use href="#icon-check"/></svg>
                              <span>Free Domain & Cpanel Host Included</span>
                            </div>
                          }

                          @if (pkg.features && pkg.features.length > 0) {
                            <div class="space-y-2 bg-[#fdfdfc] p-4 rounded-xl border border-neutral-150">
                              <span class="text-[9px] font-bold uppercase text-neutral-400 block tracking-wide select-none">Deliverables</span>
                              <div class="space-y-1.5">
                                @for (f of pkg.features; track $index) {
                                  <div class="flex items-center space-x-2 text-xs text-neutral-650 font-medium select-text">
                                    <span class="text-emerald-500 font-bold select-none">•</span>
                                    <span class="truncate" [title]="f">{{ f }}</span>
                                  </div>
                                }
                              </div>
                            </div>
                          }
                        </div>

                        <div class="bg-neutral-50 px-5 py-3 border-t border-neutral-150 flex items-center justify-end space-x-1">
                          <button (click)="openEditPackage(pkg)" class="p-1.5 hover:bg-neutral-200 hover:text-neutral-900 rounded-lg text-neutral-500 transition-colors cursor-pointer" title="Edit dimensions">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/>
                            </svg>
                          </button>
                          <button (click)="openDeleteConfirm(pkg.id, pkg.name, 'package')" class="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-neutral-400 transition-colors cursor-pointer" title="Delete tier">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    } @empty {
                      <div class="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-dashed border-neutral-300 py-16 text-center rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
                        <svg class="w-16 h-16 text-neutral-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><use href="#icon-package"/></svg>
                        <div class="space-y-1">
                          <h4 class="font-extrabold text-neutral-800">No active service tiers defined</h4>
                          <p class="text-xs text-neutral-550 max-w-sm mx-auto">Define pricing setups utilizing the button above to offer Kampala startups simple card models on layout configurations.</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- TAB 4: SETTINGS -->
              @if (activeTab() === 'settings') {
                <div class="space-y-8 text-left max-w-2xl">
                  
                  <div class="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
                    <h3 class="text-sm font-black uppercase text-[#111] border-b border-neutral-100 pb-3 flex items-center space-x-2">
                      <svg class="w-4 h-4 text-primary-blue" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-info"/></svg>
                      <span>Business & Organization Metadata</span>
                    </h3>
                    <form (submit)="handleSaveBusinessSettings($event)" class="space-y-5">
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div class="space-y-1.5">
                          <label for="biz-name" class="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">Business Name</label>
                          <input type="text" id="biz-name" [formControl]="businessNameField" class="w-full border border-neutral-350 rounded-xl px-4 py-3 text-xs text-neutral-800 bg-white outline-none focus:border-primary-blue"/>
                        </div>
                        <div class="space-y-1.5">
                          <label for="admin-display-name" class="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">Admin Display Name</label>
                          <input type="text" id="admin-display-name" [formControl]="displayNameField" class="w-full border border-neutral-350 rounded-xl px-4 py-3 text-xs text-neutral-800 bg-white outline-none focus:border-primary-blue"/>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div class="space-y-1.5">
                          <label for="wa-number" class="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">WhatsApp Contact Number</label>
                          <input type="text" id="wa-number" [formControl]="whatsappPhoneField" class="w-full border border-neutral-350 rounded-xl px-4 py-3 text-xs font-mono text-neutral-800 bg-white outline-none focus:border-primary-blue"/>
                          <span class="text-[9px] text-neutral-400 block font-mono">Include international country code first (e.g. +256749445501)</span>
                        </div>
                        <div class="space-y-1.5">
                          <label for="domain-url" class="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">Online Support Domain</label>
                          <input type="text" id="domain-url" [formControl]="domainUrlField" class="w-full border border-neutral-350 rounded-xl px-4 py-3 text-xs font-mono text-neutral-800 bg-white outline-none focus:border-primary-blue"/>
                        </div>
                      </div>

                      <button type="submit" class="bg-primary-blue hover:bg-[#0d47a1]/90 text-white font-bold text-xs px-5 py-3 rounded-xl cursor-pointer shadow-sm select-none border-none">
                        Save Business Profile
                      </button>
                    </form>
                  </div>

                  <!-- FIREBASE CONFIGURATION CARD -->
                  <div class="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_2px_15px_rgba(0,0,0,0.01)] animate-fade-in">
                    <h3 class="text-sm font-black uppercase text-[#111] border-b border-neutral-100 pb-3 flex items-center space-x-2">
                      <svg class="w-4 h-4 text-amber-600 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <use href="#icon-lightning"/>
                      </svg>
                      <span>Firebase Database Integration</span>
                    </h3>

                    @if (isLoadingFirebaseStatus()) {
                      <div class="text-center py-8 space-y-2">
                        <div class="inline-block w-6 h-6 rounded-full border-2 border-[#bf5d39]/30 border-t-[#bf5d39] animate-spin"></div>
                        <p class="text-[10px] font-mono text-neutral-450 uppercase tracking-wider">Syncing database status...</p>
                      </div>
                    } @else {
                      <div class="space-y-4">
                        <!-- Connection Status Header Badge -->
                        <div class="flex items-center justify-between">
                          <span class="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">Connection Status</span>
                          @if (firebaseActive()) {
                            <span class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 animate-pulse select-none">
                              <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                              Active & Live (Cloud Firestore)
                            </span>
                          } @else {
                            <span class="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 select-none">
                              <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                              Local Fallback Database
                            </span>
                          }
                        </div>

                        <!-- Status Explanations -->
                        @if (firebaseActive()) {
                          <div class="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-xs text-neutral-700 leading-relaxed space-y-3 text-left animate-slide-up">
                            <p>🎉 The platform is connected to a live Google Cloud Firebase back-end. All client form responses and newsletter subscriptions are written directly to <b>Cloud Firestore</b> database collections and synchronized across instances instantly.</p>
                            
                            <!-- Connected Config Table details -->
                            @if (firebaseConfigData(); as cfg) {
                              <div class="border border-emerald-100 rounded-xl bg-white overflow-hidden shadow-xs text-[11px] mt-2">
                                <table class="w-full font-mono divide-y divide-emerald-50 text-left">
                                  <tbody class="divide-y divide-emerald-50">
                                    <tr class="hover:bg-neutral-50/50"><td class="px-3.5 py-2 font-bold text-neutral-500 w-1/3">Project ID</td><td class="px-3.5 py-2 text-neutral-800 select-all">{{ cfg.projectId }}</td></tr>
                                    <tr class="hover:bg-neutral-50/50"><td class="px-3.5 py-2 font-bold text-neutral-500">App ID</td><td class="px-3.5 py-2 text-neutral-800 select-all">{{ cfg.appId }}</td></tr>
                                    <tr class="hover:bg-neutral-50/50"><td class="px-3.5 py-2 font-bold text-neutral-500">Auth Domain</td><td class="px-3.5 py-2 text-neutral-800 select-all">{{ cfg.authDomain }}</td></tr>
                                    <tr class="hover:bg-neutral-50/50"><td class="px-3.5 py-2 font-bold text-neutral-500">Storage Bucket</td><td class="px-3.5 py-2 text-neutral-800 select-all">{{ cfg.storageBucket }}</td></tr>
                                    @if (cfg.firestoreDatabaseId) {
                                      <tr class="hover:bg-neutral-50/50"><td class="px-3.5 py-2 font-bold text-neutral-500">Database ID</td><td class="px-3.5 py-2 text-neutral-800 select-all">{{ cfg.firestoreDatabaseId }}</td></tr>
                                    }
                                    <tr class="hover:bg-neutral-50/50"><td class="px-3.5 py-2 font-bold text-neutral-500">API Key</td><td class="px-3.5 py-2 text-neutral-450 select-none">{{ cfg.apiKey }}</td></tr>
                                  </tbody>
                                </table>
                              </div>
                            }

                            <div class="pt-2">
                              <button type="button" (click)="handleDisconnectFirebase()" class="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl cursor-pointer transition-all border-none active:scale-95">
                                Disconnect Firebase Backend
                              </button>
                            </div>
                          </div>
                        } @else {
                          <div class="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-xs text-neutral-700 leading-relaxed space-y-3 text-left animate-slide-up">
                            <p>⚠️ All submissions are temporarily writing to local flat JSON storage files (<code>inquiries.json</code> and <code>subscribers.json</code>) because no Firebase backend is active.</p>
                            <p>To connect a database, paste your <b>Firebase Web App SDK Configuration JSON</b> object below:</p>
                          </div>

                          <form (submit)="handleSaveFirebaseConfig($event)" class="space-y-4 text-left animate-slide-up">
                            @if (firebaseError(); as err) {
                              <div class="bg-red-50 border border-red-200 text-red-750 p-3.5 rounded-xl text-xs font-semibold flex items-start space-x-2">
                                <svg class="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-alert"/></svg>
                                <span class="leading-relaxed"><b>Connection Error:</b> {{ err }}</span>
                              </div>
                            }

                            <div class="space-y-1.5">
                              <label for="fb-config-json" class="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">Firebase Web Config JSON</label>
                              <textarea 
                                id="fb-config-json" 
                                [formControl]="firebaseConfigRawInput"
                                placeholder='{
  "apiKey": "AIzaSy...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "..."
}'
                                rows="8"
                                class="w-full border border-neutral-350 rounded-xl px-4 py-3 text-xs font-mono text-neutral-800 bg-white outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue/20"
                              ></textarea>
                              <span class="text-[9px] text-neutral-450 block">Copy the config object from your Firebase Console Settings page (Web app platform configuration).</span>
                            </div>

                            <button 
                              type="submit" 
                              [disabled]="isSavingFirebaseConfig() || firebaseConfigRawInput.invalid"
                              class="bg-[#bf5d39] hover:bg-[#9e4624] disabled:opacity-50 text-white font-bold text-xs px-5 py-3 rounded-xl cursor-pointer shadow-sm select-none border-none transition-all active:scale-95"
                            >
                              @if (isSavingFirebaseConfig()) {
                                <span>Verifying & Connecting...</span>
                              } @else {
                                <span>Connect & Initialize Backend</span>
                              }
                            </button>
                          </form>
                        }
                      </div>
                    }
                  </div>

                  <div class="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
                    <h3 class="text-sm font-black uppercase text-[#111] border-b border-neutral-100 pb-3 flex items-center space-x-2">
                      <svg class="w-4 h-4 text-primary-blue" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      <span>Security Credentials Manager</span>
                    </h3>
                    <form [formGroup]="credentialForm" (submit)="handleUpdateCredentials()" class="space-y-5">
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div class="space-y-1.5 font-sans">
                          <span class="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block">Current Registered Email</span>
                          <span class="block px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-500 select-all">{{ dataState.adminEmail() }}</span>
                        </div>
                        <div class="space-y-1.5">
                          <label for="new-email" class="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">New Admin Email Address</label>
                          <input type="email" id="new-email" formControlName="newEmail" class="w-full border border-neutral-350 rounded-xl px-4 py-3 text-xs text-neutral-800 bg-white outline-none focus:border-primary-blue" placeholder="e.g. support@bilalweb.online" />
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div class="space-y-1.5 relative">
                          <label for="new-password" class="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">New Secure Password</label>
                          <input type="password" id="new-password" formControlName="newPassword" class="w-full border border-neutral-350 rounded-xl px-4 py-3 text-xs text-neutral-800 bg-white outline-none focus:border-primary-blue"/>
                          
                          @if (newPasswordStrength(); as str) {
                            <div [class]="str.color" class="mt-1.5 p-1.5 rounded-lg border text-[10px] font-bold tracking-wide flex items-center space-x-1 select-none">
                              <span>Password Strength Indicator:</span>
                              <span class="underline uppercase">{{ str.label }}</span>
                            </div>
                          }
                        </div>
                        <div class="space-y-1.5">
                          <label for="confirm-new-password" class="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">Confirm New Password</label>
                          <input type="password" id="confirm-new-password" formControlName="confirmPassword" class="w-full border border-neutral-350 rounded-xl px-4 py-3 text-xs text-neutral-800 bg-white outline-none focus:border-primary-blue" />
                        </div>
                      </div>

                      <div class="space-y-2 border-t border-neutral-100 pt-4">
                        <label for="cur-pwd-auth" class="text-[11px] font-bold text-red-650 uppercase tracking-wide block">Current Credential Password *</label>
                        <input type="password" id="cur-pwd-auth" formControlName="currentPassword" class="w-full sm:max-w-xs border border-neutral-350 rounded-xl px-4 py-3 text-xs text-neutral-800 bg-white outline-none focus:border-primary-blue" placeholder="Confirmation to authorize save..." />
                        <span class="text-[9px] text-neutral-450 block font-sans">You must enter your current password to authorize email/password changes.</span>
                      </div>

                      <button type="submit" [disabled]="credentialForm.invalid" class="bg-primary-blue hover:bg-[#0d47a1]/90 disabled:opacity-50 text-white font-bold text-xs px-5 py-3 rounded-xl cursor-pointer shadow-sm select-none border-none">
                        Save Security Changes
                      </button>
                    </form>
                  </div>

                  <div class="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
                    <h3 class="text-sm font-black uppercase text-[#111] border-b border-neutral-100 pb-3 flex items-center space-x-2">
                       <svg class="w-4 h-4 text-primary-blue" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      <span>Session Configuration & Properties</span>
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                      <div class="space-y-1 bg-[#fcfaf6]/50 p-4 rounded-xl border border-neutral-200 flex items-center justify-between">
                        <div>
                          <span class="font-extrabold text-[#111] block">Auto-Logout Security (30m)</span>
                          <span class="text-[10px] text-neutral-450">Highly recommended on public terminals</span>
                        </div>
                        <label for="auto-logout-toggle" class="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            id="auto-logout-toggle"
                            [formControl]="autoLogoutEnabled"
                            class="sr-only peer"
                          />
                          <div class="w-8 h-4 bg-neutral-200 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-blue"></div>
                        </label>
                      </div>

                      <div class="bg-[#fcfaf6]/50 p-4 rounded-xl border border-neutral-200 space-y-2 truncate">
                        <span class="font-bold text-neutral-400 uppercase text-[9px] font-mono block">Logged In Since:</span>
                        <span class="text-xs font-mono font-bold text-[#111] block leading-tight truncate" [title]="loginTimestamp">{{ loginTimestamp }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="bg-red-50 border-2 border-red-200 p-6 sm:p-8 rounded-2xl space-y-6">
                    <div class="space-y-1 text-red-950">
                      <h4 class="font-black text-sm uppercase flex items-center space-x-2">
                        <svg class="w-4 h-4 text-red-700" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><use href="#icon-alert"/></svg>
                        <span>Systems Data Reset Zone</span>
                      </h4>
                      <p class="text-xs text-red-800 leading-relaxed">
                        Rebooting clears customized entries (projects, packages) and restarts using original verified Kampala showcases on fresh storage logs. <b class="underline">This cannot be undone.</b>
                      </p>
                    </div>

                    <button (click)="openResetAllConfirm()" class="bg-red-650 hover:bg-red-700 text-white font-bold text-xs px-5 py-3.5 rounded-xl transition-colors cursor-pointer select-none border-none">
                      Erase Everything & Start Fresh
                    </button>
                  </div>
                </div>
              }

            </main>
          </div>

          <!-- BOTTOM STICKY TAB BAR: MOBILE DEV ONLY -->
          <footer class="md:hidden bg-white border-t border-neutral-200 grid grid-cols-6 items-center select-none sticky bottom-0 z-30" id="mobile-tabs-dock">
            <button (click)="activeTab.set('overview')" [class.text-[#bf5d39]]="activeTab() === 'overview'" class="flex flex-col items-center justify-center min-h-[50px] py-1 text-neutral-450 hover:text-neutral-900 transition-colors cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#logo-uganda"/></svg>
              <span class="text-[8px] font-extrabold mt-0.5 font-sans leading-none">Overview</span>
            </button>
            <button (click)="activeTab.set('inbox')" [class.text-[#bf5d39]]="activeTab() === 'inbox'" class="flex flex-col items-center justify-center min-h-[50px] py-1 text-neutral-450 hover:text-neutral-900 transition-colors cursor-pointer relative">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-email"/></svg>
              @if (inquiriesList().length > 0) {
                <span class="absolute top-1 right-3 flex h-1.5 w-1.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bf5d39] opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#bf5d39]"></span>
                </span>
              }
              <span class="text-[8px] font-extrabold mt-0.5 font-sans leading-none">Inbox</span>
            </button>
            <button (click)="activeTab.set('portfolio')" [class.text-[#bf5d39]]="activeTab() === 'portfolio'" class="flex flex-col items-center justify-center min-h-[50px] py-1 text-neutral-450 hover:text-neutral-900 transition-colors cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-folder"/></svg>
              <span class="text-[8px] font-extrabold mt-0.5 font-sans leading-none">Portfolio</span>
            </button>
            <button (click)="activeTab.set('packages')" [class.text-[#bf5d39]]="activeTab() === 'packages'" class="flex flex-col items-center justify-center min-h-[50px] py-1 text-neutral-450 hover:text-neutral-900 transition-colors cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-package"/></svg>
              <span class="text-[8px] font-extrabold mt-0.5 font-sans leading-none">Packages</span>
            </button>
            <button (click)="activeTab.set('settings')" [class.text-[#bf5d39]]="activeTab() === 'settings'" class="flex flex-col items-center justify-center min-h-[50px] py-1 text-neutral-450 hover:text-neutral-900 transition-colors cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#icon-wrench"/></svg>
              <span class="text-[8px] font-extrabold mt-0.5 font-sans leading-none">Settings</span>
            </button>
            <button (click)="handleLogout()" class="flex flex-col items-center justify-center min-h-[50px] py-1 text-rose-500 hover:text-rose-750 transition-colors cursor-pointer">
              <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-[8px] font-extrabold mt-0.5 font-sans leading-none">Logout</span>
            </button>
          </footer>

        </div>
      }

      <!-- POPUP MODALS: PROJECT CREATE/EDIT -->
      @if (projectFormActive()) {
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 text-left">
          <div class="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl font-sans">
            <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 class="text-base font-black text-neutral-900 font-serif">
                {{ editingProject() ? 'Edit Showcase project attributes' : 'Add New Showcase Grid project' }}
              </h3>
              <button (click)="closeProjectForm()" class="text-neutral-400 hover:text-neutral-700 text-lg font-bold p-1 cursor-pointer" aria-label="Dismiss">&times;</button>
            </div>

            <form [formGroup]="projectForm" (submit)="handleSaveProject()" class="space-y-3.5">
              <!-- Project Name (required) -->
              <div class="space-y-1">
                <label for="p-name" class="text-[10px] font-bold uppercase text-neutral-500 block">Project Headline *</label>
                <input 
                  type="text" 
                  id="p-name" 
                  formControlName="name" 
                  class="w-full border rounded-xl px-3 py-2 text-xs transition-colors"
                  [class.border-red-500]="projectForm.controls.name.invalid && (projectForm.controls.name.touched || projectForm.controls.name.dirty)"
                  [class.border-neutral-300]="!(projectForm.controls.name.invalid && (projectForm.controls.name.touched || projectForm.controls.name.dirty))"
                  placeholder="e.g. Kampala Fresh Coffee"
                />
                @if (projectForm.controls.name.invalid && (projectForm.controls.name.touched || projectForm.controls.name.dirty)) {
                  <p class="text-[10px] text-red-500 font-semibold">Project Name is required.</p>
                }
              </div>

              <!-- Business Type (required, e.g., "Coffee Shop") -->
              <div class="space-y-1">
                <label for="p-type" class="text-[10px] font-bold uppercase text-neutral-500 block">Business Type / Specifications *</label>
                <input 
                  type="text" 
                  id="p-type" 
                  formControlName="type" 
                  class="w-full border rounded-xl px-3 py-2 text-xs transition-colors"
                  [class.border-red-500]="projectForm.controls.type.invalid && (projectForm.controls.type.touched || projectForm.controls.type.dirty)"
                  [class.border-neutral-300]="!(projectForm.controls.type.invalid && (projectForm.controls.type.touched || projectForm.controls.type.dirty))"
                  placeholder="e.g. Coffee Shop Website"
                />
                @if (projectForm.controls.type.invalid && (projectForm.controls.type.touched || projectForm.controls.type.dirty)) {
                  <p class="text-[10px] text-red-500 font-semibold">Business Type is required.</p>
                }
              </div>

              <!-- Website Image (Drag-and-drop or URL paste, JPG/PNG/WebP, max 500KB) -->
              <div class="space-y-2 border border-neutral-150 rounded-xl p-3 bg-neutral-50">
                <span class="text-[10px] font-bold uppercase text-neutral-500 block">Website Image Interface</span>
                
                <!-- Drag and drop zone -->
                <div 
                  (dragover)="onDragOver($event)" 
                  (drop)="onDrop($event)"
                  class="border-2 border-dashed border-neutral-300 hover:border-primary-blue bg-white rounded-xl p-4 text-center cursor-pointer transition-colors relative"
                >
                  <input 
                    type="file" 
                    id="p-file-upload" 
                    (change)="onFileSelected($event)" 
                    accept="image/jpeg,image/png,image/webp,image/jpg" 
                    class="hidden"
                  />
                  <label for="p-file-upload" class="cursor-pointer flex flex-col items-center justify-center space-y-1.5">
                    <svg class="w-6.5 h-6.5 text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 011.41-10.41l1.27-1.27a6.002 6.002 0 0110.66 2.37A4.498 4.498 0 0118 19.5H6.75z" />
                    </svg>
                    <span class="text-[11px] font-bold text-neutral-700">Drag & drop website banner, or click to upload</span>
                    <span class="text-[9px] text-neutral-400 block font-normal">Formats: JPG, PNG, WebP (Max compressed 500KB size auto-applied)</span>
                  </label>
                </div>

                <!-- URL Paste Box -->
                <div class="space-y-1 mt-2">
                  <label for="p-image-url" class="text-[9px] font-bold text-neutral-500 uppercase">Or Paste Image URL</label>
                  <input 
                    type="text" 
                    id="p-image-url" 
                    formControlName="image" 
                    class="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs text-neutral-750" 
                    placeholder="https://example.com/screenshot.jpg or data:image/jpeg;base64..."
                  />
                </div>

                <!-- Preview Box with Remove Option -->
                @if (projectForm.value.image) {
                  <div class="mt-2.5 flex items-center justify-between bg-white border border-neutral-200 rounded-xl p-2.5">
                    <div class="flex items-center space-x-2.5">
                      <img 
                        [src]="projectForm.value.image" 
                        alt="Preview" 
                        class="w-[70px] h-[45px] object-cover rounded border border-neutral-200"
                        referrerpolicy="no-referrer"
                      />
                      <div class="min-w-0">
                        <span class="text-[10px] font-bold text-neutral-800 block truncate">Image Configured</span>
                        <span class="text-[8px] text-emerald-600 font-mono tracking-tight block">Valid Base64 or Link loaded</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      (click)="projectForm.patchValue({ image: '' }); clearFileInput()" 
                      class="text-[10px] font-bold text-red-650 hover:bg-red-50 px-2 py-1 rounded border border-red-200 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                }
              </div>

              <!-- Live Demo URL (absolute or relative) Form Validation -->
              <div class="space-y-1">
                <label for="p-demo" class="text-[10px] font-bold uppercase text-neutral-500 block">Live Demo website URL *</label>
                <input 
                  type="text" 
                  id="p-demo" 
                  formControlName="demoUrl" 
                  class="w-full border rounded-xl px-3 py-2 text-xs font-mono"
                  [class.border-red-500]="projectForm.controls.demoUrl.invalid && (projectForm.controls.demoUrl.touched || projectForm.controls.demoUrl.dirty)"
                  [class.border-neutral-300]="!(projectForm.controls.demoUrl.invalid && (projectForm.controls.demoUrl.touched || projectForm.controls.demoUrl.dirty))"
                  placeholder="https://kampala-coffee.example.com or /portfolio/coffee"
                />
                @if (projectForm.controls.demoUrl.invalid && (projectForm.controls.demoUrl.touched || projectForm.controls.demoUrl.dirty)) {
                  <p class="text-[10px] text-red-500 font-semibold">Demo link URL is required (e.g. /portfolio/coffee or https://...)</p>
                }
              </div>

              <div class="space-y-1">
                <label for="p-desc" class="text-[10px] font-bold uppercase text-neutral-500 block">Highlight Description / Scope</label>
                <textarea id="p-desc" formControlName="description" rows="3" class="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs" placeholder="Warm and inviting website for a local coffee shop..."></textarea>
              </div>

              <!-- Dynamic Highlights / Pills -->
              <div class="space-y-2 border-t border-neutral-100 pt-2.5">
                <span class="text-[10px] font-bold uppercase text-neutral-500 block">Dynamic Highlight Features</span>
                
                <div class="flex space-x-2">
                  <input 
                    type="text" 
                    id="new-proj-feat-item"
                    [formControl]="newProjFeatureInput" 
                    class="flex-1 border border-neutral-300 rounded-xl px-3 py-1.5 text-xs" 
                    placeholder="e.g. 100% Mobile Money Ready"
                    (keydown.enter)="$event.preventDefault(); addProjFeature()"
                  />
                  <button type="button" (click)="addProjFeature()" class="bg-primary-blue hover:bg-[#0d47a1] text-white font-bold text-xs px-3 rounded-xl cursor-pointer">➕ Add</button>
                </div>

                <div class="flex flex-wrap gap-1 pr-1 max-h-[60px] overflow-y-auto">
                  @for (f of projFeatures(); track $index) {
                    <button type="button" (click)="removeProjFeature($index)" class="bg-neutral-100 hover:bg-red-50 hover:text-red-700 border border-neutral-200 hover:border-red-200 px-2.5 py-1 rounded-full text-[10px] font-bold font-sans flex items-center space-x-1 cursor-pointer">
                      <span>{{ f }}</span>
                      <span class="text-neutral-450">&times;</span>
                    </button>
                  } @empty {
                    <span class="text-[10px] text-neutral-450">Add highlighting pills via input row above!</span>
                  }
                </div>
              </div>

              <!-- Status Toggle: Visible / Hidden -->
              <div class="space-y-1.5 p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                 <div class="flex items-center space-x-3 justify-between">
                   <span class="text-xs font-bold text-neutral-700 cursor-pointer select-none">Status visibility on site</span>
                   <div class="flex items-center space-x-2">
                     <span class="text-[10px] font-bold font-mono tracking-tight uppercase" [class.text-emerald-600]="projectForm.value.visible" [class.text-neutral-550]="!projectForm.value.visible">
                       {{ projectForm.value.visible ? 'Visible' : 'Hidden' }}
                     </span>
                     <label for="p-visible" class="relative inline-flex items-center cursor-pointer">
                       <input 
                         type="checkbox" 
                         id="p-visible"
                         formControlName="visible" 
                         class="sr-only peer"
                         aria-label="Toggle visible on site status"
                       />
                       <div class="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-blue"></div>
                     </label>
                   </div>
                 </div>
              </div>

              <div class="flex justify-end space-x-2 border-t border-neutral-100 pt-3">
                <button type="button" (click)="closeProjectForm()" class="border border-neutral-300 text-neutral-600 font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" [disabled]="projectForm.invalid" class="bg-[#0039cb] hover:bg-[#002fbe] disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- POPUP MODALS: PACKAGE CREATE/EDIT -->
      @if (packageFormActive()) {
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 text-left">
          <div class="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 class="text-base font-black text-neutral-900 font-serif">
                {{ editingPackage() ? 'Edit Pricing tier specifications' : 'Create New Pricing Packages details' }}
              </h3>
              <button (click)="closePackageForm()" class="text-neutral-400 hover:text-neutral-700 text-lg font-bold p-1 cursor-pointer" aria-label="Dismiss">&times;</button>
            </div>

            <form [formGroup]="packageForm" (submit)="handleSavePackage()" class="space-y-3.5">
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div class="sm:col-span-8 space-y-1">
                  <label for="pkg-name-field" class="text-[10px] font-bold uppercase text-neutral-500 block">Package Name Title *</label>
                  <input type="text" id="pkg-name-field" formControlName="name" class="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs" placeholder="e.g. Gold E-Commerce"/>
                </div>
                <div class="sm:col-span-4 space-y-1">
                  <label for="pkg-icon-field" class="text-[10px] font-bold uppercase text-neutral-500 block">Visual Icon *</label>
                  <select id="pkg-icon-field" formControlName="icon" class="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-800 bg-white">
                    @for (choice of availableIconsList(); track choice) {
                      <option [value]="choice">{{ choice.replace('icon-', '') }} Accent</option>
                    }
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label for="pkg-price-field" class="text-[10px] font-bold uppercase text-neutral-500 block">Investment Price (UGX digits only) *</label>
                  <input type="text" id="pkg-price-field" formControlName="price" class="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono" placeholder="e.g. 500000"/>
                </div>
                <div class="space-y-1">
                  <label for="pkg-delivery-field" class="text-[10px] font-bold uppercase text-neutral-500 block">Delivery Timeline *</label>
                  <input type="text" id="pkg-delivery-field" formControlName="delivery" class="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs" placeholder="e.g. 3-5 Business Days"/>
                </div>
              </div>

              <div class="space-y-1">
                <label for="pkg-desc-field" class="text-[10px] font-bold uppercase text-neutral-500 block">Brief Overview Description *</label>
                <textarea id="pkg-desc-field" formControlName="description" rows="3" class="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs" placeholder="Describe scope details..."></textarea>
              </div>

              <div class="space-y-2 border-t border-neutral-100 pt-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase text-neutral-500">Deliverables & Features Checklist</span>
                  <button type="button" (click)="addPackageFeatureRow()" class="text-primary-blue hover:underline font-extrabold text-[10px] cursor-pointer">+ Add Deliverable Row</button>
                </div>

                <div class="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  @for (row of pkgFeaturesList(); track $index) {
                    <div class="flex items-center space-x-2">
                      <input 
                        type="text" 
                        [value]="row" 
                        (input)="updatePackageFeatureRow($index, $any($event.target).value)"
                        placeholder="e.g. 5 Complete pages with subpages structures" 
                        class="flex-1 border border-neutral-300 rounded-xl px-3 py-1.5 text-xs"
                        aria-label="Feature input row"
                      />
                      <button type="button" (click)="removePackageFeatureRow($index)" class="p-1 text-neutral-400 hover:text-red-550 cursor-pointer" title="Remove deliverable row">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </button>
                    </div>
                  } @empty {
                    <div class="text-[10px] text-neutral-400 py-1.5 text-center">No features rows set. Click button to add dynamic checkmarks!</div>
                  }
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-150">
                <div class="flex items-center space-x-2">
                  <input type="checkbox" id="free-dns" formControlName="freeDomainHosting" class="w-4 h-4 text-primary-blue rounded border-neutral-300"/>
                  <label for="free-dns" class="text-[11px] font-bold text-neutral-600 select-none cursor-pointer">Domain & Hosting Included</label>
                </div>
                <div class="flex items-center space-x-2">
                  <input type="checkbox" id="is-pop" formControlName="mostPopular" class="w-4 h-4 text-[#f9a825] border-neutral-300 rounded"/>
                  <label for="is-pop" class="text-[11px] font-bold text-neutral-600 select-none cursor-pointer">Most Popular Badge Highlight</label>
                </div>
              </div>

              <div class="flex justify-end space-x-2 border-t border-neutral-100 pt-3">
                <button type="button" (click)="closePackageForm()" class="border border-neutral-300 text-neutral-600 font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" [disabled]="packageForm.invalid" class="bg-[#0d47a1] hover:bg-[#0d47a1]/90 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">Save Package Pricing</button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      15%, 45%, 75% { transform: translateX(-5px); }
      30%, 60%, 90% { transform: translateX(5px); }
    }
    .animate-shake {
      animation: shake 0.35s ease-in-out;
    }
  `]
})
export class AdminComponent implements OnDestroy {
  dataState = inject(DataState);
  router = inject(Router);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  // Navigation variables & session timestamp
  isLoggedIn = signal(false);
  activeTab = signal<string>('overview');
  inquiriesList = signal<Inquiry[]>([]);
  isLoadingInquiries = signal<boolean>(false);
  mobileMenuOpen = signal<boolean>(false);
  loginTimestamp = '';
  todayString = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Alerts, Confirmations & Lockouts
  toast = signal<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  confirmTarget = signal<{ id: string; name: string; type: 'project' | 'package' | 'factoryReset' } | null>(null);
  
  failedAttemptsCount = 0;
  loginLocked = signal<boolean>(false);
  lockTimer = signal<number>(0);
  shakeError = signal<boolean>(false);
  passwordVisible = signal<boolean>(false);
  loginError = signal<string | null>(null);

  // Login Input Controls
  loginEmail = new FormControl('bilal@bilalweb.online', { nonNullable: true, validators: [Validators.required, Validators.email] });
  loginPassword = new FormControl('Bilal2025!', { nonNullable: true, validators: [Validators.required] });
  rememberMe = new FormControl(false, { nonNullable: true });

  // Filtering / Sorting values
  portfolioSearchQuery = new FormControl('');
  packagesSearchQuery = new FormControl('');
  projectSort = signal<string>('name');
  packageSort = signal<string>('name');

  // SVG selector presets choices index
  availableIconsList = signal<string[]>([
    'icon-page', 'icon-building', 'icon-cart', 'icon-bag', 'icon-refresh', 'icon-wrench',
    'icon-location', 'icon-coffee', 'icon-barber', 'icon-fashion', 'icon-lightning', 
    'icon-star', 'icon-package', 'icon-folder', 'icon-link', 'icon-whatsapp', 'icon-info'
  ]);

  // Project Modals Variables
  projectFormActive = signal(false);
  editingProject = signal<Project | null>(null);
  projectForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    demoUrl: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern('^(https?://|/).+')] }),
    image: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    visible: new FormControl(true, { nonNullable: true })
  });
  newProjFeatureInput = new FormControl('');
  projFeatures = signal<string[]>([]);

  // Packages Modals Variables
  packageFormActive = signal(false);
  editingPackage = signal<Package | null>(null);
  packageForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    icon: new FormControl('icon-package', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern('^[0-9]+$')] }),
    delivery: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    freeDomainHosting: new FormControl(true, { nonNullable: true }),
    mostPopular: new FormControl(false, { nonNullable: true }),
  });
  pkgFeaturesList = signal<string[]>([]);

  // Settings Fields Toggles
  businessNameField = new FormControl('');
  displayNameField = new FormControl('');
  whatsappPhoneField = new FormControl('');
  domainUrlField = new FormControl('');

  autoLogoutEnabled = new FormControl(true, { nonNullable: true });

  // Firebase configuration management variables
  firebaseActive = signal<boolean>(false);
  firebaseConfigData = signal<any>(null);
  isLoadingFirebaseStatus = signal<boolean>(false);
  isSavingFirebaseConfig = signal<boolean>(false);
  firebaseConfigRawInput = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  firebaseError = signal<string | null>(null);

  // Security Update Form
  credentialForm = new FormGroup({
    newEmail: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    newPassword: new FormControl('', { nonNullable: true }),
    confirmPassword: new FormControl('', { nonNullable: true }),
    currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  private logoutInterval: ReturnType<typeof setInterval> | undefined;

  // Reactivity filter projections
  filteredProjects = computed(() => {
    let list = this.dataState.projects();
    const query = this.portfolioSearchQuery.value?.toLowerCase().trim() || '';
    if (query) {
      list = list.filter(p => p.name.toLowerCase().includes(query) || p.type.toLowerCase().includes(query));
    }
    const sort = this.projectSort();
    return [...list].sort((a, b) => {
      if (sort === 'date') {
        const timeA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
        const timeB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
        return timeB - timeA;
      }
      return a.name.localeCompare(b.name);
    });
  });

  filteredPackages = computed(() => {
    let list = this.dataState.packages();
    const query = this.packagesSearchQuery.value?.toLowerCase().trim() || '';
    if (query) {
      list = list.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
    }
    const sort = this.packageSort();
    return [...list].sort((a, b) => {
      if (sort === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
      if (sort === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
      return a.name.localeCompare(b.name);
    });
  });

  // New password strength analysis computed indicator
  newPasswordStrength = computed(() => {
    const pw = this.credentialForm.controls.newPassword.value;
    if (!pw) return null;
    if (pw.length < 6) return { label: 'Weak (Length < 6)', color: 'text-red-650 bg-red-50 border-red-200' };
    const hasNum = /[0-9]/.test(pw);
    const hasScl = /[^A-Za-z0-9]/.test(pw);
    const hasUpp = /[A-Z]/.test(pw);
    if (pw.length >= 8 && hasNum && hasScl && hasUpp) {
      return { label: 'Strong (Great choice)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    return { label: 'Medium', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  });

  lastUpdatedDate = computed(() => {
    const feed = this.dataState.activityFeed();
    if (feed.length > 0) {
      return new Date(feed[0].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    return 'Up to Date';
  });

  constructor() {
    this.titleService.setTitle('Admin Dashboard Console | Bilal Web Kampala');
    this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    this.metaService.updateTag({ name: 'description', content: 'Administrative zone for client files customization, MoMo payment updates, project listings and workspace configuration.' });

    this.checkForExistentActiveSession();
    this.initialiseAutoLogoutTrackers();

    // Sync settings fields inside reactive pipeline
    effect(() => {
      if (this.isLoggedIn()) {
        this.businessNameField.setValue(this.dataState.businessName());
        this.displayNameField.setValue(this.dataState.displayName());
        this.whatsappPhoneField.setValue(this.dataState.whatsappNumber());
        this.domainUrlField.setValue(this.dataState.domainName());
      }
    });
  }

  ngOnDestroy() {
    if (this.logoutInterval) {
      clearInterval(this.logoutInterval);
    }
  }

  // Check storage session tags
  private checkForExistentActiveSession() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('bilalweb_session');
      const email = localStorage.getItem('bilalweb_admin_email') || 'bilal@bilalweb.online';
      this.loginEmail.setValue(email);

      if (stored) {
        try {
          const sObj = JSON.parse(stored);
          if (sObj.loggedIn) {
            // Check expiry fallback (30m)
            const diff = Date.now() - (sObj.lastActivity || 0);
            if (this.autoLogoutEnabled.value && diff > 30 * 60 * 1000) {
              this.handleLogout(true);
            } else {
              this.isLoggedIn.set(true);
              this.loginTimestamp = sObj.loginTime ? new Date(sObj.loginTime).toLocaleString() : new Date().toLocaleString();
              this.updateActivityTimerInStorage();
              this.fetchInquiries();
              this.fetchFirebaseConfig();
            }
          }
        } catch {
          this.handleLogout(false);
        }
      }
    }
  }

  // Active session inactivity timer update
  private initialiseAutoLogoutTrackers() {
    if (typeof window !== 'undefined') {
      const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
      const hitInactivityEvent = () => {
        if (this.isLoggedIn()) {
          this.updateActivityTimerInStorage();
        }
      };
      
      events.forEach(ev => window.addEventListener(ev, hitInactivityEvent));

      // Minute based checker
      this.logoutInterval = setInterval(() => {
        if (this.isLoggedIn() && this.autoLogoutEnabled.value) {
          const stored = localStorage.getItem('bilalweb_session');
          if (stored) {
            try {
              const sObj = JSON.parse(stored);
              const diff = Date.now() - (sObj.lastActivity || 0);
              if (diff > 30 * 60 * 1000) {
                this.handleLogout(true);
              }
            } catch {
              /* ignore fallback parser errors */
            }
          }
        }
      }, 15000);
    }
  }

  private updateActivityTimerInStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const current = localStorage.getItem('bilalweb_session');
      let loginTStr = Date.now();
      if (current) {
        try { 
          loginTStr = JSON.parse(current).loginTime || Date.now(); 
        } catch {
          /* ignore fallback errors */
        }
      }
      const sObj = { loggedIn: true, loginTime: loginTStr, lastActivity: Date.now() };
      localStorage.setItem('bilalweb_session', JSON.stringify(sObj));
    }
  }

  // Newsletter Subscriber list deletion
  async removeSubscriber(email: string) {
    if (confirm(`Are you sure you want to delete "${email}" from the newsletter mailing list?`)) {
      const deleted = await this.dataState.deleteSubscriber(email);
      if (deleted) {
        this.showToast('success', `E-mail "${email}" removed from database list successfully.`);
      } else {
        this.showToast('error', 'Could not delete subscriber.');
      }
    }
  }

  // Toast notifier alert show
  showToast(type: 'success' | 'error' | 'info', message: string) {
    this.toast.set({ type, message });
    setTimeout(() => {
      if (this.toast()?.message === message) {
        this.toast.set(null);
      }
    }, 3000);
  }

  // Authentication Submission Flow
  handleLogin(event: Event) {
    event.preventDefault();
    this.loginError.set(null);

    const emailInput = this.loginEmail.value?.trim();
    const passwordInput = this.loginPassword.value;

    if (!emailInput || !passwordInput) {
      this.shakeError.set(true);
      this.loginError.set('Email and password are required');
      this.showToast('error', 'Fields empty: Email and password are required');
      setTimeout(() => this.shakeError.set(false), 500);
      return;
    }

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, password: passwordInput })
    })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (ok && data.success) {
        this.isLoggedIn.set(true);
        this.failedAttemptsCount = 0;
        this.loginTimestamp = new Date().toLocaleString();

        const sess = { loggedIn: true, loginTime: Date.now(), lastActivity: Date.now() };
        localStorage.setItem('bilalweb_session', JSON.stringify(sess));
        
        // Update local credentials cache
        this.dataState.updateCredentials(emailInput, passwordInput);

        this.showToast('success', 'Logged in successfully! Welcome back.');
        this.dataState.logActivity('Admin Login', `Logged in administrator: "${emailInput}"`);
        this.fetchInquiries();
        this.fetchFirebaseConfig();
      } else {
        this.failedAttemptsCount++;
        this.loginError.set(data.error || 'Invalid email or password');
        this.showToast('error', data.error || 'Wrong Credentials');

        if (this.failedAttemptsCount >= 5) {
          this.loginLocked.set(true);
          this.lockTimer.set(120);
          this.showToast('error', 'Locked for 2 minutes due to security triggers.');
          
          const countdown = setInterval(() => {
            this.lockTimer.update(val => {
              if (val <= 1) {
                clearInterval(countdown);
                this.loginLocked.set(false);
                this.failedAttemptsCount = 0;
                return 0;
              }
              return textVal(val);
            });
          }, 1000);
        }
      }
    })
    .catch(err => {
      this.loginError.set('Connection to authentication server failed');
      this.showToast('error', 'Connection failed');
    });
  }

  handleLogout(automatic = false) {
    this.isLoggedIn.set(false);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('bilalweb_session');
    }
    this.loginPassword.reset();
    this.showToast(automatic ? 'error' : 'info', automatic ? 'Session expired: logged out automatically.' : 'Logged out successfully');
  }

  // Sorting handlers
  handleProjectSortChange(event: Event) {
    const sel = event.target as HTMLSelectElement;
    this.projectSort.set(sel.value);
  }

  handlePackageSortChange(event: Event) {
    const sel = event.target as HTMLSelectElement;
    this.packageSort.set(sel.value);
  }

  getActivePackagesCount(): number {
    return this.dataState.packages().filter(p => p.active !== false).length;
  }

  getTabIconId(tab: string): string {
    const map: Record<string, string> = {
      'overview': 'logo-uganda',
      'inbox': 'icon-email',
      'portfolio': 'icon-folder',
      'packages': 'icon-package',
      'settings': 'icon-wrench'
    };
    return map[tab] || 'icon-info';
  }

  async fetchInquiries() {
    this.isLoadingInquiries.set(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          this.inquiriesList.set(data.inquiries || []);
        }
      }
      // Simultaneously sync subscribers mailing list
      await this.dataState.fetchSubscribersFromServer();
    } catch (e) {
      console.error('Could not fetch inquiries or subscribers:', e);
    } finally {
      this.isLoadingInquiries.set(false);
    }
  }

  exportToCSV() {
    if (typeof document === 'undefined') return;
    
    const inquiries = this.inquiriesList();
    if (inquiries.length === 0) {
      this.showToast('error', 'No client inquiries in database to export.');
      return;
    }

    const headers = ['Inquiry ID', 'Name', 'Business Name', 'Contact Info/Email/Phone', 'Technical Scope/Message', 'Submitted At (ISO)', 'Submitted At (Formatted)'];
    
    const rows = inquiries.map(inq => [
      inq.id || '',
      inq.name || '',
      inq.businessName || 'N/A',
      inq.contactInfo || '',
      inq.message || '',
      inq.timestamp || '',
      this.formatInquiryTime(inq.timestamp)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => {
        const str = String(val);
        return `"${str.replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\r\n');

    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `bilalweb_inquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.showToast('success', `Export completed! ${inquiries.length} inquiries successfully compiled to CSV.`);
      this.dataState.logActivity('CSV Exported', `Generated CRM export file with ${inquiries.length} active inquiries`);
    } catch (err) {
      console.error('Failed to generate CSV export:', err);
      this.showToast('error', 'Failed to compile and download CSV file.');
    }
  }

  async deleteInquiry(id: string) {
    if (confirm('Are you sure you want to delete this client inquiry permanently?')) {
      try {
        const res = await fetch(`/api/inquiries/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            this.showToast('success', 'Client inquiry removed from database.');
            this.fetchInquiries();
            this.dataState.logActivity('Inquiry Erased', `Deleted client inquiry ID: ${id}`);
          }
        }
      } catch (e) {
        this.showToast('error', 'Could not delete inquiry.');
        console.error('Delete inquiry error:', e);
      }
    }
  }

  formatInquiryTime(iso: string): string {
    if (!iso) return 'N/A';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  }

  cleanNumber(rawInfo: string): string {
    if (!rawInfo) return '';
    return rawInfo.replace(/\+/g, '').replace(/[^0-9]/g, '');
  }

  formatShortTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  formatUgx(val: string): string {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) return val;
    return new Intl.NumberFormat('en-UG').format(parsed);
  }

  // CRUD CONFIRMATIONS TRASH TRIGGERS
  openDeleteConfirm(id: string, name: string, type: 'project' | 'package') {
    this.confirmTarget.set({ id, name, type });
  }

  executeConfirmedAction(c: { id: string; name: string; type: 'project' | 'package' | 'factoryReset' }) {
    if (c.type === 'project') {
      this.dataState.deleteProject(c.id);
      this.showToast('success', `Project "${c.name}" deleted successfully.`);
    } else if (c.type === 'package') {
      this.dataState.deletePackage(c.id);
      this.showToast('success', `Package "${c.name}" deleted successfully.`);
    } else if (c.type === 'factoryReset') {
      this.dataState.resetAllData();
      this.showToast('success', 'Systems successfully hard-reset to original default showcases.');
    }
    this.confirmTarget.set(null);
  }

  // RESET CHANNELS DANGER PLACARD
  openResetAllConfirm() {
    this.confirmTarget.set({ id: 'factory-reset', name: 'Original Factory Default Setups & Logs', type: 'factoryReset' });
  }

  // Visibility toggle
  toggleProjectVisibility(id: string, currentVal: boolean) {
    this.dataState.updateProject(id, { visible: !currentVal });
    this.showToast('info', 'Showcase visibility index updated.');
  }

  togglePackageStatus(id: string, currentVal: boolean) {
    this.dataState.updatePackage(id, { active: !currentVal });
    this.showToast('info', 'Pricing package active index updated.');
  }

  // CRUD PROJECTS METHODS
  openAddProject() {
    this.editingProject.set(null);
    this.projectForm.reset({
      name: '',
      type: '',
      demoUrl: '/portfolio/project',
      image: '',
      description: '',
      visible: true
    });
    this.projFeatures.set(['Mobile Native Layout', 'SEO Indexes Enabled', 'Direct WhatsApp Ordering']);
    this.projectFormActive.set(true);
  }

  openEditProject(proj: Project) {
    this.editingProject.set(proj);
    this.projectForm.setValue({
      name: proj.name,
      type: proj.type || proj.businessType || '',
      demoUrl: proj.demoUrl || '',
      image: proj.image || '',
      description: proj.description || '',
      visible: proj.visible !== false
    });
    this.projFeatures.set([...(proj.features || [])]);
    this.projectFormActive.set(true);
  }

  closeProjectForm() {
    this.projectFormActive.set(false);
    this.editingProject.set(null);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  processFile(file: File) {
    if (!file.type.match(/image\/(jpeg|png|webp|jpg)/i)) {
      this.showToast('error', 'Unsupported format! Only JPG, PNG, and WebP are supported.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawBase64 = e.target?.result as string;
      this.compressImage(rawBase64, (compressed) => {
        this.projectForm.patchValue({ image: compressed });
      });
    };
    reader.readAsDataURL(file);
  }

  compressImage(base64Str: string, callback: (result: string) => void) {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Keep dimensions within max 1200px to maintain crisp layout and avoid heavy memory profiles
      const maxDim = 1200;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
      }
      
      // Auto-convert to WebP format with exactly 75% quality setting
      const result = canvas.toDataURL('image/webp', 0.75);
      callback(result);
    };
  }

  addProjFeature() {
    const val = this.newProjFeatureInput.value?.trim();
    if (val) {
      this.projFeatures.update(curr => [...curr, val]);
      this.newProjFeatureInput.reset();
    }
  }

  removeProjFeature(idx: number) {
    this.projFeatures.update(curr => curr.filter((_, i) => i !== idx));
  }

  handleSaveProject() {
    if (this.projectForm.invalid) return;
    const values = this.projectForm.getRawValue();
    const edit = this.editingProject();

    if (edit) {
      this.dataState.updateProject(edit.id, {
        name: values.name,
        type: values.type,
        businessType: values.type,
        demoUrl: values.demoUrl,
        image: values.image,
        description: values.description,
        visible: values.visible
      });
      this.dataState.updateProject(edit.id, { features: this.projFeatures() });
      this.showToast('success', 'Project attributes saved successfully');
    } else {
      this.dataState.addProject({
        name: values.name,
        type: values.type,
        businessType: values.type,
        demoUrl: values.demoUrl,
        image: values.image,
        description: values.description,
        features: this.projFeatures(),
        icon: 'icon-folder'
      });
      this.showToast('success', 'New Portfolio Showcase Appended.');
    }
    this.closeProjectForm();
  }

  // CRUD PRICING PACKAGES
  openAddPackage() {
    this.editingPackage.set(null);
    this.packageForm.reset({
      name: '',
      icon: 'icon-package',
      price: '',
      delivery: '3-5 Days',
      description: '',
      freeDomainHosting: true,
      mostPopular: false
    });
    this.pkgFeaturesList.set([
      'Beautiful Custom Layout design',
      'Free 1 yr Host + online domain registration',
      'Fast delivery index config',
      'WhatsApp ordering balloon integration'
    ]);
    this.packageFormActive.set(true);
  }

  openEditPackage(pkg: Package) {
    this.editingPackage.set(pkg);
    this.packageForm.setValue({
      name: pkg.name,
      icon: pkg.icon || 'icon-package',
      price: String(pkg.price),
      delivery: pkg.delivery || pkg.deliveryTime || '3-5 Days',
      description: pkg.description,
      freeDomainHosting: pkg.freeDomainHosting !== false,
      mostPopular: !!pkg.mostPopular
    });
    this.pkgFeaturesList.set([...(pkg.features || [])]);
    this.packageFormActive.set(true);
  }

  closePackageForm() {
    this.packageFormActive.set(false);
    this.editingPackage.set(null);
  }

  addPackageFeatureRow() {
    this.pkgFeaturesList.update(list => [...list, '']);
  }

  updatePackageFeatureRow(idx: number, text: string) {
    this.pkgFeaturesList.update(list => list.map((val, i) => i === idx ? text : val));
  }

  removePackageFeatureRow(idx: number) {
    this.pkgFeaturesList.update(list => list.filter((_, i) => i !== idx));
  }

  handleSavePackage() {
    if (this.packageForm.invalid) return;
    const values = this.packageForm.getRawValue();
    const edit = this.editingPackage();

    const cleanFeatures = this.pkgFeaturesList().map(s => s.trim()).filter(Boolean);

    if (edit) {
      this.dataState.updatePackage(edit.id, {
        name: values.name,
        icon: values.icon,
        price: values.price,
        delivery: values.delivery,
        deliveryTime: values.delivery,
        description: values.description,
        freeDomainHosting: values.freeDomainHosting,
        includingDomainHosting: values.freeDomainHosting,
        mostPopular: values.mostPopular,
        isMostPopular: values.mostPopular,
        features: cleanFeatures
      });
      this.showToast('success', 'Pricing Packages Modified Successfully');
    } else {
      this.dataState.addPackage({
        name: values.name,
        icon: values.icon,
        price: values.price,
        delivery: values.delivery,
        description: values.description,
        freeDomainHosting: values.freeDomainHosting,
        mostPopular: values.mostPopular,
        features: cleanFeatures
      });
      this.showToast('success', 'New Pricing tier successfully set.');
    }
    this.closePackageForm();
  }

  // MODIFY GLOBAL CONFIGURATION
  handleSaveBusinessSettings(event: Event) {
    event.preventDefault();
    const name = this.businessNameField.value?.trim() || 'Bilal Web';
    const disp = this.displayNameField.value?.trim() || 'Bilal';
    const phone = this.whatsappPhoneField.value?.trim() || '+256749445501';
    const dom = this.domainUrlField.value?.trim() || 'bilalweb.online';

    this.dataState.updateSettings(name, disp, phone, dom);
    this.showToast('success', 'Corporate Profile Settings saved successfully');
  }

  // MODIFY SECURITY CREDENTIALS
  async handleUpdateCredentials() {
    const curPass = this.credentialForm.controls.currentPassword.value;
    if (curPass !== this.dataState.adminPassword()) {
      this.showToast('error', 'Authentication failed: Incorrect confirmation password.');
      return;
    }

    const newEmail = this.credentialForm.controls.newEmail.value?.trim() || this.dataState.adminEmail();
    const newPass = this.credentialForm.controls.newPassword.value || this.dataState.adminPassword();
    const confPass = this.credentialForm.controls.confirmPassword.value;

    if (newPass !== confPass && this.credentialForm.controls.newPassword.value) {
      this.showToast('error', 'Authorization mismatch: Confirm passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/update-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: curPass, newEmail, newPassword: newPass })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.dataState.updateCredentials(newEmail, newPass);
        this.credentialForm.reset({
          newEmail: '',
          newPassword: '',
          confirmPassword: '',
          currentPassword: ''
        });
        this.showToast('success', 'Administrative security parameters successfully updated!');
      } else {
        this.showToast('error', data.error || 'Failed to update credentials on server');
      }
    } catch (err: any) {
      this.showToast('error', 'Connection failed: ' + err.message);
    }
  }

  handleNotificationsClick() {
    this.showToast('info', 'System status: All administrative metrics, CRM databases, and API channels are fully synchronized & functional.');
  }

  async fetchFirebaseConfig() {
    this.isLoadingFirebaseStatus.set(true);
    this.firebaseError.set(null);
    try {
      const res = await fetch('/api/firebase-config');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          this.firebaseActive.set(data.active);
          this.firebaseConfigData.set(data.config);
          if (data.active && data.config) {
            const displayConfig = { ...data.config };
            // Let the raw input be a placeholder template for modifications or prefill with masked key
            this.firebaseConfigRawInput.setValue(JSON.stringify(displayConfig, null, 2));
          } else {
            this.firebaseConfigRawInput.setValue('');
          }
        }
      }
    } catch (err: any) {
      console.error('Error fetching firebase config:', err);
    } finally {
      this.isLoadingFirebaseStatus.set(false);
    }
  }

  async handleSaveFirebaseConfig(event: Event) {
    event.preventDefault();
    this.firebaseError.set(null);
    
    const rawVal = this.firebaseConfigRawInput.value?.trim();
    if (!rawVal) {
      this.firebaseError.set('Configuration JSON cannot be empty');
      this.showToast('error', 'Configuration input empty');
      return;
    }

    let parsedConfig;
    try {
      parsedConfig = JSON.parse(rawVal);
    } catch (e) {
      this.firebaseError.set('Invalid JSON format. Please paste a valid Firebase configuration JSON object.');
      this.showToast('error', 'Invalid JSON syntax');
      return;
    }

    if (!parsedConfig.projectId || !parsedConfig.apiKey || !parsedConfig.appId) {
      this.firebaseError.set('Missing required Firebase fields: projectId, apiKey, and appId are required.');
      this.showToast('error', 'Missing required configuration keys');
      return;
    }

    this.isSavingFirebaseConfig.set(true);
    try {
      const res = await fetch('/api/firebase-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedConfig)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.showToast('success', 'Firebase backend connected and verified successfully!');
        this.dataState.logActivity('Firebase Connected', `Connected project ID: "${parsedConfig.projectId}"`);
        await this.fetchFirebaseConfig();
        await this.fetchInquiries();
      } else {
        this.firebaseError.set(data.error || 'Failed to connect Firebase backend');
        this.showToast('error', data.error || 'Connection verification failed');
      }
    } catch (err: any) {
      this.firebaseError.set(err instanceof Error ? err.message : String(err));
      this.showToast('error', 'Connection request failed');
    } finally {
      this.isSavingFirebaseConfig.set(false);
    }
  }

  async handleDisconnectFirebase() {
    if (confirm('Are you sure you want to disconnect the Firebase backend? The application will immediately revert to storing inquiries and subscribers in local JSON files.')) {
      this.isLoadingFirebaseStatus.set(true);
      try {
        const res = await fetch('/api/firebase-config', {
          method: 'DELETE'
        });
        const data = await res.json();
        if (res.ok && data.success) {
          this.showToast('success', 'Firebase backend disconnected successfully. Reverted to local JSON database.');
          this.dataState.logActivity('Firebase Disconnected', 'Reverted database storage to local server files.');
          await this.fetchFirebaseConfig();
          await this.fetchInquiries();
        } else {
          this.showToast('error', data.error || 'Failed to disconnect Firebase backend');
        }
      } catch (err: any) {
        this.showToast('error', 'Request failed: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        this.isLoadingFirebaseStatus.set(false);
      }
    }
  }

  clearFileInput() {
    if (typeof document !== 'undefined') {
      const el = document.getElementById('p-file-upload') as HTMLInputElement;
      if (el) el.value = '';
    }
  }
}

function textVal(val: number): number {
  return val - 1;
}
