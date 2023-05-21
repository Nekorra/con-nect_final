import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
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

  goRegister() {
    this.router.navigate(['/register']);
  }

}
