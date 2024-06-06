import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  @ViewChild('logo') logo!: ElementRef;
  constructor(private router: Router,
              private aniCtrl: AnimationController) { }
  ngAfterViewInit(): void{
    const animacion = this.aniCtrl.create()
    .addElement(this.logo.nativeElement)
    .duration(3000)
    .fromTo('transform', 'translateY(100px) scale(0)', 'translateY(0px) scale(1)')
    .fromTo('opacity', '0', '1');
    animacion.play()
  }    

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/login'])
    }, 6000);
    Preferences.clear(); 
  }
  

}
