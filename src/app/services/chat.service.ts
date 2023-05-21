import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap, map, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

export interface User {
  uid: string;
  email: string;
}

export interface Message {
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
  
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  currentUser: User = null;
  matchUser: any;
  user: any;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
  }

  createChat(id: string, matchID: string) {
    return this.afs.collection('users').doc(id).collection('chats').doc(matchID).collection('chats').add({
      from: this.currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  addChatMessage(name: string, msg: string, master: string, slave: string) {
    console.log(slave)
      return this.afs.collection('users').doc(master).collection('chats').doc(slave).collection('chats').add({
        name: name,
        msg: msg,
        from: master,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
  }
  
    async getChatMessages(master: string, slave: string) {
      return this.afs.collection('users').doc(master).collection('chats').doc(slave).collection('chats', ref=>ref.orderBy('Timestamp')).doc().valueChanges();
    }

}