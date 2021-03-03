import { Component, Input, OnInit } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { GroupActionBTNRenderer } from 'src/app/pipes/ag-group-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { Group, GuestUsers, Room } from 'src/app/shared/models/data-model'
import { AuthenticationService } from 'src/app/services/auth.service';
import { GroupMembersPage } from 'src/app/shared/actions/group-members/group-members.page';
import { EductaionService } from 'src/app/services/education.service';
import { YesNoBTNRenderer } from 'src/app/pipes/ag-yesno-renderer';
import { DateTimeCellRenderer } from 'src/app/pipes/ag-datetime-renderer';

@Component({
  selector: 'cranix-mygroups',
  templateUrl: './mygroups.page.html',
  styleUrls: ['./mygroups.page.scss'],
})
export class MyGroupsPage implements OnInit {
  segment: string = 'groups';
  objectKeys: string[] = [];
  columnDefs = [];
  defaultColDef = {};
  gridApi: GridApi;
  columnApi: ColumnApi;
  rowSelection;
  context;
  title = 'app';
  rowData = [];
  modules = [];

  constructor(
    public authService: AuthenticationService,
    public educationService: EductaionService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    public route: Router,
    public translateService: TranslateService
  ) {
    this.context = { componentParent: this };
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      hide: false,
      suppressMenu: true
    }
  }
  ngOnInit() {
    this.groupColumnDefs();
  }


  segmentChanged(event) {
    console.log(event)
    this.segment = event.detail.value;
    switch (this.segment) {
      case 'group': { this.groupColumnDefs(); break; }
      case 'user': { this.userColumnDefs(); break; }
      case 'guest': { this.guestColumnDefs(); break; }
    }
  }

  groupColumnDefs() {
    this.objectService.getObjects('education/group').subscribe(obj => this.rowData = obj);
    this.columnDefs = [
      {
        field: 'id',
        hide: true
      },
      {
        field: 'name',
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: this.authService.settings.checkboxSelection,
        minWidth: 150,
        suppressSizeToFit: true,
      },
      {
        headerName: "",
        minWidth: 150,
        suppressSizeToFit: true,
        cellStyle: { 'padding': '2px' },
        field: 'actions',
        cellRendererFramework: GroupActionBTNRenderer
      },
      {
        field: 'description',
        minWidth: 250,
        headerName: this.languageS.trans('description')
      },
      {
        field: 'groupType',
        minWidth: 150,
        headerName: this.languageS.trans('groupType'),
        hide: false,
        valueGetter: function (params) {
          return params.context['componentParent'].languageS.trans(params.data.groupType);
        }
      }
    ];
  }

  userColumnDefs() {
    this.objectService.getObjects('education/user').subscribe(obj => this.rowData = obj);
    this.columnDefs = [
      {
        field: 'groupName',
        headerName: this.languageS.trans('groupName'),
        minWidth: 150,
        headerCheckboxSelectionFilteredOnly: true,
        headerCheckboxSelection: true,
        checkboxSelection: this.authService.settings.checkboxSelection
      },
      {
        field: 'uid',
        sortable: true,
        headerName: this.languageS.trans('uid')
      },
      {
        field: 'givenName',
        sortable: true,
        headerName: this.languageS.trans('givenName')
      },
      {
        field: 'surName',
        sortable: true,
        headerName: this.languageS.trans('surName')
      }
    ];
  }

  guestColumnDefs() {
    this.readGuestAccounts();
    this.columnDefs = [
      {
        field: 'id',
        hide: true
      },
      {
        field: 'name',
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: this.authService.settings.checkboxSelection,
        minWidth: 150,
        suppressSizeToFit: true,
      },
      {
        headerName: "",
        minWidth: 150,
        suppressSizeToFit: true,
        cellStyle: { 'padding': '2px' },
        field: 'actions',
        cellRendererFramework: GroupActionBTNRenderer
      },
      {
        field: 'description',
        minWidth: 250,
        headerName: this.languageS.trans('description')
      },
      {
        headerName: this.languageS.trans('count'),
        field: 'count'
      },
      {
        headerName: this.languageS.trans('privateGroup'),
        field: 'privateGroup',
        cellRendererFramework: YesNoBTNRenderer
      },
      {
        headerName: this.languageS.trans('createAdHocRoom'),
        field: 'createAdHocRoom',
        cellRendererFramework: YesNoBTNRenderer
      },
      {
        headerName: this.languageS.trans('validUntil'),
        field: 'validUntil',
        cellRendererFramework: DateTimeCellRenderer
      }
    ];
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  onQuickFilterChanged(quickFilter) {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.gridApi.doLayout();

  }

  sizeAll() {
    this.gridApi.sizeColumnsToFit();
    window.addEventListener('resize', function () {
      setTimeout(function () {
        this.gridApi.sizeColumnsToFit();
      });
    });
    this.gridApi.sizeColumnsToFit();
  }

  public redirectToDelete = (group: Group) => {
    this.objectService.deleteObjectDialog(group, 'education/group', '')
  }
  /**
  * Open the actions menu with the selected object ids.
  * @param ev
  */
  async openActions(ev: any, objId: number) {
    let selected = this.gridApi.getSelectedRows();
    if (selected.length == 0 && !objId) {
      this.objectService.selectObject();
      return;
    }
    let objectIds = [];
    if (objId) {
      objectIds.push(objId)
    } else {
      for (let i = 0; i < selected.length; i++) {
        objectIds.push(selected[i].id);
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "education/" + this.segment,
        objectIds: objectIds,
        selection: selected
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }

  /**
   * Function to add or edit a group.
   * Group is null a new group will be created.
   * @param ev 
   * @param group 
   */
  async redirectToMembers(ev: Event, group: Group) {
    this.objectService.selectedObject = group;
    const modal = await this.modalCtrl.create({
      component: GroupMembersPage,
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }
  async redirectToEdit(ev: Event, group: Group) {
    let action = 'modify';
    if (!group) {
      group = new Group();
      action = 'add';
    }
    delete group.groupType;
    delete group.id;
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      cssClass: 'medium-modal',
      componentProps: {
        objectType: "education/group",
        objectAction: action,
        object: group
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }

  async addEditGuest(guest: GuestUsers) {
    let action = 'modify';
    if (!guest) {
      guest = new GuestUsers();
      action = 'add';
    }

    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      cssClass: 'medium-modal',
      componentProps: {
        action: action,
        guest: guest
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }
  readGuestAccounts() {
    this.educationService.getGuestAccounts().subscribe(
      (val) => { this.rowData = val }
    )
  }
}

@Component({
  selector: 'cranix-add-edit-guest',
  templateUrl: './add-edit-guest.html'
})
export class AddEditGuestPage implements OnInit{

  rooms: Room[]
  selectedRooms: Room[]
  @Input() guest
  @Input() action
  constructor(
    public educationService: EductaionService,
    public modalCtrl: ModalController
  ) {
  }
  ngOnInit() {
  }

  onSubmit(guest){

  }
}

