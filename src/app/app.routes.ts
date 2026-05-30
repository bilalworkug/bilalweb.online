import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./views/home').then(m => m.HomeComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./views/services').then(m => m.ServicesComponent)
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./views/portfolio').then(m => m.PortfolioComponent)
  },
  {
    path: 'portfolio/:id',
    loadComponent: () => import('./views/project-details').then(m => m.ProjectDetailsComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./views/about').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./views/contact').then(m => m.ContactComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./views/admin').then(m => m.AdminComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
