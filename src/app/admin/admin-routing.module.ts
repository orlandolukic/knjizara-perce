import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSectionGuard } from 'src/app/shared/guards/admin-section-guard';
import { DashboardComponent } from '../shared/components/dashboard/dashboard.component';
import { RecommendationsComponent } from '../user/recommendations/recommendations.component';
import { MainAdminComponent } from './main-admin/main-admin.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [ AdminSectionGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
