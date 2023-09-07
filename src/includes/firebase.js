import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCYHZBFejNl7aHUAgXlUdqzPY00YRHatng',
  authDomain: 'music-11495.firebaseapp.com',
  projectId: 'music-11495',
  storageBucket: 'music-11495.appspot.com',
  appId: '1:963147974537:web:f4624ba0dd5b68ef8bc358'
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')

export { auth, db, usersCollection, songsCollection, storage }
