import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNftComponent } from './create-nft/create-nft.component';
import { HomeComponent } from './home/home.component';
import { MyListedItemsComponent } from './Items/my-listed-items/my-listed-items.component';
import { MyPurchasesComponent } from './Items/my-purchases/my-purchases.component';
import { AccountGuard } from './account.guard';
import { FirstPageComponent } from './first-page/first-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path:"",component:FirstPageComponent},
  {path:"home",component:HomeComponent},
  {path:"createNft",component:CreateNftComponent, canActivate:[AccountGuard]},
  {path:"myListedItems",component:MyListedItemsComponent, canActivate:[AccountGuard]},
  {path:"myPurchases",component:MyPurchasesComponent, canActivate:[AccountGuard] },
  {path:"admin",component:DashboardComponent, canActivate:[AccountGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
