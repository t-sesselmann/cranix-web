import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { IonicModule } from '@ionic/angular';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { TranslateService } from '@ngx-translate/core';
import { InformationsComponent, AddEditInfoPage } from 'src/app/protected/cranix/informations/informations.component'
import { QuillModule } from 'ngx-quill';
 
const routes: Routes = [
  {
    path: 'informations',
    canActivate: [CanActivateViaAcls],
    component: InformationsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CranixSharedModule,
    IonicModule,
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [InformationsComponent, AddEditInfoPage ],
  providers: [TranslateService]
})
export class InformationsModule { }
