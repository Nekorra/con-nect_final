import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Gesture, GestureController, IonCard, Platform } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import * as geofirestore from 'geofirestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { AuthenticationService } from '../services/authentication.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';

import { Animation, AnimationController } from '@ionic/angular';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-find',
  templateUrl: './find.page.html',
  styleUrls: ['./find.page.scss'],
})
export class FindPage implements OnInit{

  user: any;
  latitude: any;
  longitude: any;
  people = []
  matches: any = [];
  notMatches: any = [];
  cardArray: any;

  @ViewChildren(IonCard, {read: ElementRef}) cards: QueryList<ElementRef>

  constructor(
    private router: Router,
    private gestureCtrl: GestureController,
    private plt: Platform,
    private authService: AuthenticationService,
     private geolocation: Geolocation,
    private loadController: LoadingController,
    private database: DatabaseService,
    private animationCtrl: AnimationController,
    private chatService: ChatService

  ) { }

  async getUser() {
    await this.authService.getUser().then((user) =>{ 
      this.user = user
    })
    await this.authService.getUserInfo(this.user.uid).then((userInfo: any) => {
      if (userInfo.matches) {
        for (let i = 0; i < userInfo.matches.length; i++) {
          this.matches.push(userInfo.matches[i])
        }
      }
      if (userInfo.notMatches) {
        for (let i = 0; i < userInfo.notMatches.length; i++) {
          this.matches.push(userInfo.notMatches[i])
        }
      }
    })
  }

  async ionViewDidEnter() {
    await this.getUser();
    this.addGeo();
  }

  ngOnInit(): void {
      
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  async useSwipe(index: number) {
    console.log(this.cardArray)
    console.log("test", index)
    let card = this.cardArray[index];
    const gesture: Gesture = this.gestureCtrl.create({
      el: card.nativeElement,
      gestureName: 'swipe',
      direction: 'x',
      onStart: ev => {
      },
      onMove: ev => {
        card.nativeElement.style.transform = `translateX(${ev.deltaX}px)`;
        this.setCardColor(ev.deltaX, card.nativeElement)
      },
      onEnd: ev => {
        card.nativeElement.style.transition = '.5s ease-out';
        if (ev.deltaX > 150) {
          card.nativeElement.style.transform = `translateX(${+this.plt.width() * 2}px)`;
          this.updateMatches(this.people[index].uid);
          this.cardArray.splice(index, 1);
          this.people.splice(index, 1);
        } else if (ev.deltaX < -150) {
          card.nativeElement.style.transform = `translateX(-${+this.plt.width() * 2}px)`;
          this.updateNotMatches(this.people[index].uid);
          this.cardArray.splice(index, 1);
          this.people.splice(index, 1);
        } else {
          card.nativeElement.style.transform = '';
        }
      }
    });
    gesture.enable(true);
    
    
  }

  setCardColor(x, element) {
    let color = '';
    const abs = Math.abs(x)
    const min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16))
    const hexCode = this.decimalToHex(min, 2);

    if (x < 0) {
      color = '#ff'+ hexCode + hexCode;
    } else {
      color = '#' + hexCode + 'FF' + hexCode;
    }
    element.style.backgroundColor = color;

  }

  decimalToHex(d, padding) {
      let hex = Number(d).toString(16);
      padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
  
      while (hex.length < padding) {
        hex = "0" + hex;
      }
      return hex;
  
  }

  async showLoading() {
    
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  } 

  async addGeo() {
    const loading = await this.loadController.create({
      message: 'Fetching nearest neighbors',
    });

    loading.present();

    console.log("test")
    await this.geolocation.getCurrentPosition().then(async (position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log(this.latitude, this.longitude);
      const firestore = firebase.firestore();
      const GeoFirestore = geofirestore.initializeApp(firestore);
      const geocollection = GeoFirestore.collection('users');
      const geodocument = GeoFirestore.collection('users').doc(this.user.uid);

      geodocument.update({
      // The coordinates field must be a GeoPoint!
      coordinates: new firebase.firestore.GeoPoint(this.latitude, this.longitude),
      })

      const query = geocollection.near({ center: new firebase.firestore.GeoPoint(this.latitude, this.longitude), radius: 10 });
      await query.get().then((value) => {
        // All GeoDocument returned by GeoQuery, like the GeoDocument added above
        console.log("length", value.docs.length);
        for(let x = 0; x < value.docs.length; x++) {
          if ((value.docs[x].id != this.user.uid) && (!this.notMatches.includes(value.docs[x].id) && (!this.matches.includes(value.docs[x].id)))) {
            this.authService.getUserInfo(value.docs[x].id).then((userInfo) => { 
              console.log(userInfo)
              this.people.push(userInfo);
            }) 
          }
        }
      });
      this.delay(2000).then((data) => {
        //this.useSwipe(this.cardArray);
        this.cardArray = this.cards.toArray();
      });
      console.log(this.cardArray);
      loading.dismiss();
      
    });
    
  
  }

  updateMatches(matchID: string) {
    console.log(matchID);
    this.authService.getUserInfo(matchID).then((userInfo: any) => {
      if (userInfo.matches) {
        if (userInfo.matches.includes(this.user.uid)) {
          this.database.updateOfficialMatches(matchID, this.user.uid);
          this.chatService.createChat(this.user.uid, matchID);
          
        }
      }
      if (userInfo.notMatches) {
        if (userInfo.notMatches.includes(this.user.uid)) {
          this.database.removeMatches(matchID, this.user.uid);
        }
      }
    })
    this.database.updateMatches(matchID, this.user.uid);
  }

  updateNotMatches(matchID: string) {
    console.log(matchID);
    this.authService.getUserInfo(matchID).then((userInfo: any) => {
      if (userInfo.matches) {
        if (userInfo.matches.includes(this.user.uid)) {
          this.database.removeMatches(matchID, this.user.uid);
        }
      }
      
    })
    this.database.updateNotMatches(matchID, this.user.uid);
  }


}
