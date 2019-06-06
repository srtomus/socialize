import { Component, OnInit } from '@angular/core';
import LocationPicker from "location-picker";

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.css']
})
export class NewGroupComponent implements OnInit {
  lp: LocationPicker;
   
  ngOnInit(){
    this.lp = new LocationPicker('map');
  }
  
  setLocation() {
     console.log(this.lp.getMarkerPosition());
  }

}
