import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { DxDataGridModule, DxToolbarModule } from 'devextreme-angular';
import { GraphQLModule } from './graphql.module';
import { AppComponent } from './app.component';
import { MainPageTest } from './my-page/my-page.component';
import { DataGridComponent } from './second-page/second-page.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [AppComponent, DataGridComponent, MainPageTest],
  imports: [
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    DxDataGridModule,
    GraphQLModule,
    DxToolbarModule,
  ],
  providers: [provideHttpClient(), provideAnimations(), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
