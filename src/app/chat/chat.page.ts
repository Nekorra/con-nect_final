import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})


export class ChatPage implements OnInit {
  
  items: string[] = [];
  end: boolean;
  user: any;
  matches: any[] = [];
  matchesData: any[] = [];
  name: any
  chats: any[] = [];
  master: any;
  slave: any;

  constructor(
    private authService: AuthenticationService,
    private database: DatabaseService,
    private nav: NavController
  ) { }

  async ionViewDidEnter() {
    this.matches = []
    this.matchesData = []
    this.chats = []
    this.items = []
    for (let i = 1; i < 31; i++) {
      this.items.push(`Item ${i}`);
    }

    this.getUserData();
  }

  async pushToNextScreenWithParams(pageUrl: string, index: number) {
    await this.authService.getUserInfo(this.user.uid).then((data: any) => {
      this.name = data.firstName;
      for (let i = 0; i < data.chats.length; i++) {
        this.chats.push(data.chats[i])
      }
    })
    if (this.chats.includes(this.user.uid)) {
      this.master = this.user.uid;
      this.slave = this.matchesData[index].uid;
    }
    if (this.chats.includes(this.matchesData[index].uid)) {
      this.master = this.matchesData[index].uid;
      this.slave = this.user.uid;
    }
    let params = {name: this.name, uid: this.user.uid, matchId: this.matchesData[index].uid, master: this.master, slave: this.slave}
    console.log(params)
    this.nav.navigateForward(pageUrl, { state: params });
  }

  ngOnInit() {
    this.matches = []
    this.matchesData = []

  }

  async getUserData() {
    await this.authService.getUser().then((user: any) =>{ 
      this.user = user

    })
    await this.authService.getUserInfo(this.user.uid).then((userInfo: any) => {
      this.name = userInfo.firstName;
      if (userInfo.officialMatches) {
        for (let i = 0; i < userInfo.officialMatches.length; i++) {
          this.matches.push(userInfo.officialMatches[i])
        }
      }
    })
    this.getMatchesData()
  }

  getMatchesData() {
    for (let i = 0; i < this.matches.length; i++) {
      this.authService.getUserInfo(this.matches[i]).then((userInfo) => {
        this.matchesData.push(userInfo);
        console.log(this.matchesData)
      })
    }
    console.log(this.matchesData)
  }


}