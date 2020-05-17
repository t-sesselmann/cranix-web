import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';

//Own modules
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { Room } from 'src/app/shared/models/data-model';

@Component({
  selector: 'cranix-room-edit',
  templateUrl: './room-edit.page.html',
  styleUrls: ['./room-edit.page.scss'],
})
export class RoomEditPage implements OnInit {
  editForm;
  objectId: number=0;
  object: Room = null;
  objectKeys: string[] = [];
  constructor(
    public translateService: TranslateService,
    public formBuilder: FormBuilder,
    public objectService: GenericObjectService
  ) { 
    this.object = <Room>this.objectService.selectedObject;
    this.objectKeys = Object.getOwnPropertyNames(new Room());
    console.log("RoomEditPage:" + this.object.id);
  }
  ngOnInit() {
    this.editForm = this.formBuilder.group(this.objectService.convertObject(this.object));
  }
  onSubmit(form){
    form['id'] = this.object.id;
    this.objectService.modifyObjectDialog(form,"room");
  }
  delete(ev: Event){
     this.objectService.deleteObjectDialog(this.object,'room');
  }  
}