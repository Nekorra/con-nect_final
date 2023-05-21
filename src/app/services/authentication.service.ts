import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first } from 'rxjs';

export interface UserCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore
    ) { }

  async register(credentials: UserCredentials) {
    return this.afAuth.createUserWithEmailAndPassword(credentials.email, credentials.password).then((data: any) => {
      this.firestore.doc(`users/${data.user.uid}`).set({
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: data.user.email,
        role: credentials.role,
        uid: data.user.uid
      });
    })
  }

  login(credentials: UserCredentials) {
    return this.afAuth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }
  
  getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  getUserInfo(userId: string) {
    return this.firestore.collection('users').doc(`${userId}`).valueChanges().pipe(first()).toPromise();
  }

  resetPassword(email: string) {
    console.log(email);
    this.afAuth.sendPasswordResetEmail(email).then(() => {
      alert('Email sent successfully');
    }, err => {
      alert('Something Went Wrong. Please Try Again!');
    })
  }

}