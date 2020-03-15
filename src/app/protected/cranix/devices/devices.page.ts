import { Component, OnInit, ɵSWITCH_RENDERER2_FACTORY__POST_R3__ } from '@angular/core';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
import { AlertController, PopoverController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from '../../../shared/actions/actions.component';
import { ActionBTNRenderer } from '../../../pipes/ag-action-renderer';
import { ObjectsEditComponent } from '../../../shared/objects-edit/objects-edit.component';
import { GenericObjectService } from '../../../services/generic-object.service';
import { LanguageService } from '../../../services/language.service';
import { SelectColumnsComponent } from '../../../shared/select-columns/select-columns.component';
import { Device } from '../../../shared/models/data-model'
import { HwconfIdCellRenderer } from '../../../pipes/ag-hwconfid-renderer';
import { RoomIdCellRenderer } from '../../../pipes/ag-roomid-render';

@Component({
  selector: 'cranix-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['name', 'mac', 'ip', 'hwconfId', 'roomId', 'actions'];
  sortableColumns: string[] = ['name', 'mac', 'ip', 'hwconfId', 'roomId'];
  columnDefs = [];
  gridOptions: GridOptions;
  gridApi: GridApi;
  columnApi: ColumnApi;
  rowSelection;
  context;
  selected: Device[];
  title = 'app';
  rowData = [];
  objectIds: number[] = [];

  constructor(
    public alertController: AlertController,
    private objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    private storage: Storage
  ) {
    this.context = { componentParent: this };
    this.rowSelection = 'multiple';
    this.objectKeys = Object.getOwnPropertyNames(new Device());
    this.createColumnDefs();
    this.gridOptions = <GridOptions>{
      defaultColDef: {
        resizable: true,
        sortable: true,
        hide: false
      },
      columnDefs: this.columnDefs,
      context: this.context
    }
  }
  ngOnInit() {
    this.storage.get('DevicesPage.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = myArray.concat(['actions']);
        this.createColumnDefs();
      }
    });
    this.objectService.getObjects('device').subscribe(obj => this.rowData = obj);
  }
  createColumnDefs() {
    let columnDefs = [];
    for (let key of this.objectKeys) {
      let col = {};
      col['field'] = key;
      col['headerName'] = this.languageS.trans(key);
      col['hide'] = (this.displayedColumns.indexOf(key) == -1);
      col['sortable'] = (this.sortableColumns.indexOf(key) != -1);
      switch (key) {
        case 'name': {
          col['headerCheckboxSelection'] = true;
          col['headerCheckboxSelectionFilteredOnly'] = true;
          col['checkboxSelection'] = true;
          break;
        }
        case 'hwconfId': {
          col['valueGetter'] = function(params) {
            return params.context['componentParent'].objectService.idToName('hwconf',params.data.hwconfId);
          }
          //col['cellRendererFramework'] = HwconfIdCellRenderer;
          break;
        }
        case 'roomId': {
          col['valueGetter'] = function(params) {
            return params.context['componentParent'].objectService.idToName('room',params.data.roomId);
          }
          //col['cellRendererFramework'] = RoomIdCellRenderer;
          break;
        }
      }
      columnDefs.push(col);
    }
    columnDefs.push({
      headerName: "",
      field: 'actions',
      cellRendererFramework: ActionBTNRenderer
    });
    this.columnDefs = columnDefs;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.7) + "px";
    this.gridApi.sizeColumnsToFit();
  }
  onSelectionChanged() {
    this.selected = this.gridApi.getSelectedRows();
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById("quickFilter")).value);
    this.gridApi.doLayout();

  }
  onResize($event) {
    (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.75) + "px";
    this.sizeAll();
    this.gridApi.sizeColumnsToFit();
  }
  sizeAll() {
    var allColumnIds = [];
    this.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.columnApi.autoSizeColumns(allColumnIds);
  }

  redirectToDelete(device: Device) {
    this.objectService.deleteObjectDialog(device, 'device')
  }
  /**
 * Open the actions menu with the selected object ids.
 * @param ev 
 */
  async openActions(ev: any) {
    if (this.selected) {
      for (let i = 0; i < this.selected.length; i++) {
        this.objectIds.push(this.selected[i].id);
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "device",
        objectIds: this.objectIds,
        selection: this.selected
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  async redirectToEdit(ev: Event, device: Device) {
    let action = 'modify';
    if (device == null) {
      device = new Device();
      action = 'add';
    }
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      componentProps: {
        objectType: "device",
        objectAction: action,
        object: device,
        objectKeys: this.objectKeys
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        console.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }

  /**
* Function to select the columns to show
* @param ev 
*/
  async openCollums(ev: any) {
    const modal = await this.modalCtrl.create({
      component: SelectColumnsComponent,
      componentProps: {
        columns: this.objectKeys,
        selected: this.displayedColumns,
        objectPath: "DevicesPage.displayedColumns"
      },
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.displayedColumns = dataReturned.data.concat(['actions']);
      }
      this.createColumnDefs();
    });
    (await modal).present().then((val) => {
      console.log("most lett vegrehajtva.")
    })
  }
}
