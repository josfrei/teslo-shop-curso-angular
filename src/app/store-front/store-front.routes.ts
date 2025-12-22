import { Component } from "@angular/core";
import { StoreFrontLayout } from "./layouts/store-front-layout/store-front-layout";
import { Routes } from "@angular/router";
import { HomePage } from "./pages/home-page/home-page";
import { GenderPage } from "./pages/gender-page/gender-page";
import { ProductPage } from "./pages/product-page/product-page";
import ComerPage from '../../../../deruta/src/app/pages/comer-page/comer-page';
import { NotFoundPage } from "./pages/not-found-page/not-found-page";

export const storeFrontRoutes: Routes = [
  {
    path: '',
    component: StoreFrontLayout,
    children: [
      {
        path: '',
        component: HomePage
      },
      {
        path: 'gender/:gender',
        component: GenderPage
      },
      {
        path: 'product/:idSlug',
        component: ProductPage
      },
      {
        path: '**',
        component: NotFoundPage
      }
    ],
  },
  {
    path: '**',
    redirectTo: '',
  }

];

export default storeFrontRoutes;
