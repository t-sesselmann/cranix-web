import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatTableModule,
  MatStepperModule,
  MatButtonModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatTooltipModule,
} from "@angular/material";
import { ToolbarComponent } from '../protected/toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../pipes/pipe-modules';
import { AgGridModule } from 'ag-grid-angular';
import { ActionBTNRenderer } from '../pipes/ag-action-renderer';
import { DateCellRenderer } from '../pipes/ag-date-renderer';
import { DateTimeCellRenderer } from '../pipes/ag-datetime-renderer';
import { GroupIdCellRenderer } from 'src/app/pipes/ag-groupid-renderer';
import { HwconfIdCellRenderer } from '../pipes/ag-hwconfid-renderer';
import { RoomIdCellRenderer } from '../pipes/ag-roomid-render';
import { DeviceIdCellRenderer } from '../pipes/ag-deviceid-renderer';
import { InstituteIdCellRenderer } from '../pipes/ag-instituteid-renderer';
import { UpdateRenderer } from '../pipes/ag-update-renderer';
import { UserIdCellRenderer } from '../pipes/ag-userid-renderer';
import { UserIdToNameCellRenderer } from '../pipes/ag-userid-to-name-renderer';
import { NameActionRenderer } from '../pipes/name-action-renderer';

@NgModule({
  declarations: [ 
    ActionBTNRenderer, 
    DateCellRenderer,
    DateTimeCellRenderer,
    DeviceIdCellRenderer,
    GroupIdCellRenderer,
    HwconfIdCellRenderer,
    NameActionRenderer,
    InstituteIdCellRenderer,
    RoomIdCellRenderer,
    UpdateRenderer,
    UserIdCellRenderer,
    UserIdToNameCellRenderer,
    ToolbarComponent,
  ],
  imports: [
  CommonModule,
  AgGridModule.withComponents( [
    ActionBTNRenderer, 
    DateCellRenderer,
    DateTimeCellRenderer,
    DeviceIdCellRenderer,
    GroupIdCellRenderer,
    HwconfIdCellRenderer,
    InstituteIdCellRenderer,
    RoomIdCellRenderer,
    UpdateRenderer,
    NameActionRenderer,
    UserIdCellRenderer,
    UserIdToNameCellRenderer
  ]),
  FormsModule,
  IonicModule,
  MatTableModule,
  MatStepperModule,
  MatButtonModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatTooltipModule,
  ReactiveFormsModule,
  PipesModule,
  TranslateModule,
  ], exports: [
    CommonModule,
    AgGridModule,
    FormsModule,
    IonicModule,
    MatTableModule,
    MatStepperModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    PipesModule,
    ReactiveFormsModule,
    TranslateModule,
    ToolbarComponent,
  ]
})
export class CranixSharedModule { }
