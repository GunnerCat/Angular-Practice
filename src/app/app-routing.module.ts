import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageTest } from './my-page/my-page.component';
import { DataGridComponent } from './second-page/second-page.component';

const routes: Routes = [
  {
    path: '', // Default path
    component: MainPageTest, // Main page component
    children: [
      {
        path: 'second-page', // Child path
        component: DataGridComponent, // Child page component
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
