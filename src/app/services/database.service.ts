import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore'
import { Photo } from '@capacitor/camera';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  storageRef: any;

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
  ) { }

  async addImage(cameraFile: Photo, id: string) {
    const path = `profileIcons/${id}.png`
    console.log(path);
    this.storageRef = this.storage.ref(path);
    console.log("storage", this.storageRef);
    await this.storageRef.putString(cameraFile, 'data_url');
    const imageUrl = await this.storageRef.getDownloadURL().toPromise();
    console.log("imageUrl", imageUrl);
    await this.firestore.collection('users').doc(id).update({
      image: imageUrl,
    })
  }

  updateBio(data: any, id: string) {
    return this.firestore.collection('users').doc(id).update({
      bio: data
    })
  }

  updateMatches(matchId: any, id: string) {
    return this.firestore.collection('users').doc(id).update({
      matches: arrayUnion(matchId)
    })
  }

  updateNotMatches(matchId: any, id: string) {
    return this.firestore.collection('users').doc(id).update({
      notMatches: arrayUnion(matchId)
    })
  }

  updateOfficialMatches(matchId: any, id: string) {
    this.firestore.collection('users').doc(id).update({
      officialMatches: arrayUnion(matchId),
      chats: arrayUnion(id)
    })
    this.firestore.collection('users').doc(matchId).update({
      officialMatches: arrayUnion(id),
      chats: arrayUnion(id)
    })
  }

  removeMatches(matchId: string, id: string) {
    this.firestore.collection('users').doc(matchId).update({
      matches: arrayRemove(id),
      notMatches: arrayUnion(id)
    })
  }
  
}
