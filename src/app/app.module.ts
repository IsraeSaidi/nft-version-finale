import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import { MatDividerModule} from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import {MatGridListModule} from '@angular/material/grid-list';
import { RouterModule ,Routes, CanActivate} from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import { HomeComponent } from './home/home.component';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { CreateNftComponent } from './create-nft/create-nft.component';
import { MyListedItemsComponent } from './Items/my-listed-items/my-listed-items.component';
import { MyPurchasesComponent } from './Items/my-purchases/my-purchases.component';
import { PanierComponent } from './panier/panier.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { FirstPageComponent } from './first-page/first-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    NavbarComponent,
    CreateNftComponent,
    MyListedItemsComponent,
    MyPurchasesComponent,
    PanierComponent,
    FavoriteComponent,
    FirstPageComponent,
    DashboardComponent,

  
    
  ],
  imports: [
    MatDialogModule,
    MatIconModule,
    HttpClientModule,
    MatSnackBarModule,
    MatCardModule,
    FormsModule,
    MatGridListModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    NgApexchartsModule

    
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [PanierComponent]

})
export class AppModule { }
