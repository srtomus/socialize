import { Component, OnInit } from '@angular/core';
import LocationPicker from "location-picker";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Group } from '../models/group.model';
import { GroupService } from '../services/group.service';
import { UserService } from '../services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.css'],
  providers: [GroupService, UserService]
})
export class NewGroupComponent implements OnInit {
  lp: LocationPicker;
  public title;
  public identity;
  public url: string;
  public token;
  public stats;
  public status;
  public group: Group;
  public lat;
  public lng;
  public coords;

  constructor(
    private titleService: Title,
    private _userService: UserService,
    private _groupService: GroupService,
    private _router: Router
  ) {
    this.url = 'http://' + window.location.hostname + ':3000/api/';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.group = new Group("", "", this.identity._id, "", "", null, null, "", "", "", "", "");
    this.title = "Crear nuevo grupo";
  }

  ngOnInit() { // Se crea el mapa nada más cargar la página
    this.setTitle(this.title);
    this.lp = new LocationPicker('map', {
      setCurrentPosition: true,
    }, {
        // Opciones por defecto establecidas
        zoom: 15,
        center: { lat: 39.47018073020985, lng: -0.3770092068236952 }
      });
  }

  setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  setLocation() { // Se ejecuta al hacer click en enviar
    this.coords = this.lp.getMarkerPosition(); // Se obtiene la posición exacta
    this.lat = this.coords.lat; // Se almacena la latitud en una variable
    this.lng = this.coords.lng; // Se almacena la longitud en una variable
    this.group.lat = this.lat; // El parámetro latitud del grupo se cambia por el obtenido
    this.group.lng = this.lng; // El parámetro longitud del grupo se cambia por el obtenido
  }

  onSubmit(form) {
    this._groupService.addGroup(this.token, this.group).subscribe(
      response => {
        this.group = response.group;
        form.reset();
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {this.status = 'error';}
      }
    )
  }
}
