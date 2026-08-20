import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Users } from './pages/users/users';
import { Products } from './pages/products/products';
import { authGuard } from './core/guards/auth-guard';
import { Orders } from './pages/orders/orders';
import { OrderSingle } from './pages/order-single/order-single';
import { ProductSingle } from './pages/product-single/product-single';
import { Blogs } from './pages/blogs/blogs';
import { BlogSingle } from './pages/blog-single/blog-single';
import { SettingsScreen } from './pages/settings-screen/settings-screen';
import { Documents } from './pages/documents/documents';
import { Pharmacies } from './pages/pharmacies/pharmacies';
import { PharmacySingle } from './pages/pharmacy-single/pharmacy-single';
import { guestGuard } from './core/guards/guest-guard';
import { BlogCreate } from './pages/blog-create/blog-create';
import { BlitzBulletin } from './pages/blitz-bulletin/blitz-bulletin';
import { BlitzBulletinSingle } from './pages/blitz-bulletin-single/blitz-bulletin-single';
import { BlitzBulletinCreate } from './pages/blitz-bulletin-create/blitz-bulletin-create';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPassword,
        canActivate: [guestGuard]
    },
    {
        path: '',
        component: MainLayout,
        canActivate:[authGuard],
        children:[
            {
                path:'dashboard',
                component:Dashboard
            },
            {
                path:'pharmacies',
                component:Pharmacies
            },
            {
                path:'pharmacy-single/:id',
                component:PharmacySingle
            },
            {
                path:'users',
                component:Users
            },
            {
                path:'products',
                component:Products
            },
            {
                path:'product-single/:id',
                component:ProductSingle
            },
            {
                path:'orders',
                component:Orders
            },
            {
                path:'order-single/:id',
                component:OrderSingle
            },
            {
                path:'blitz-bulletin',
                component:BlitzBulletin
            },
            {
                path:'blitz-bulletin/:id',
                component:BlitzBulletinSingle
            },
            {
                path:'blitz-bulletin-create',
                component:BlitzBulletinCreate
            },
            {
                path:'blogs',
                component:Blogs
            },
            {
                path:'blog-single/:id',
                component:BlogSingle
            },
            {
                path:'blog-create',
                component:BlogCreate
            },
            {
                path:'documents',
                component:Documents
            },
            {
                path:'settings',
                component:SettingsScreen
            }
        ]
    }

];
