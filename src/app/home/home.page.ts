import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  constructor(
    private router: Router,
  ) { }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  ngOnInit() {
  }
  
  goNext() {
    console.log("next")
    this.swiper?.slideNext();
  }

  goBack() {
    console.log("back")
    this.swiper?.slidePrev();
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  async redirect() {
    await Browser.open({url: 'https:google.com'})
  }

}