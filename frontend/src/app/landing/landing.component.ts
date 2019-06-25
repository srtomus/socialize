import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  public title: string;

  public constructor(private titleService: Title ) { 
    this.title = "Socialize";
  }
 
  ngOnInit() {
    this.setTitle(this.title)
  }

  setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

}
