import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-convo',
  templateUrl: './convo.page.html',
  styleUrls: ['./convo.page.scss'],
})
export class ConvoPage implements OnInit {


  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMsg = '';
  uid: any;
  matchID: any;
  name: any;
  master: any;
  slave: any;
  chatRef: any;

  constructor(
    private chatService: ChatService, 
    private router: Router,
    private afs: AngularFirestore
  ) { 
    console.log(this.chatRef)
    if (this.router.getCurrentNavigation().extras.state) {
      const pageName = this.router.getCurrentNavigation().extras.state;
      console.log(pageName)
      this.uid = pageName['uid']; 
      this.matchID = pageName['matchId']; 
      this.name = pageName['name'];
      this.master = pageName['master'];
      this.slave = pageName['slave'];
      console.log(this.uid, this.matchID);
    }
  }

  ngOnInit() {
   
  }


  ionViewDidEnter() {
    this.chatRef = this.afs.collection('users').doc(this.master).collection('chats').doc(this.slave).collection('chats', ref=>ref.orderBy('createdAt')).valueChanges();

  }


  sendMessage() {
    console.log(this.newMsg, this.name, this.master, this.slave);
    this.chatService.addChatMessage(this.name, this.newMsg, this.master, this.slave).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
    
  }

}

