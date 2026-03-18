import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'chatbot',
        pathMatch: 'full'
    }, {
        path: 'chatbot',
        loadComponent: () => import('./features/chatbot/chatbot').then(c => c.Chatbot)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(c => c.Dashboard)
    },
    {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found').then(c => c.NotFound)
    }
];
