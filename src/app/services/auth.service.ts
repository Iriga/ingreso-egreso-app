import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from "rxjs/operators";
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) { }

    initAuthListener() {
        this.auth.authState.subscribe( fuser => {
            console.log('fuser -> ', fuser);
            console.log('fuser -> ', fuser?.uid);
            console.log('fuser -> ', fuser?.email);
        })
    }

    crearUsuario(nombre: string, email: string, password: string) {
        return this.auth.createUserWithEmailAndPassword(email, password)
                    .then(({user}) => {

                        const newUser = new Usuario( user.uid, nombre, user.email);

                        return this.firestore.doc(`${user.uid}/usuario`).set( {...newUser} );

                    });
    }

    loginUsuario(email: string, password: string) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    logOut() {
        return this.auth.signOut();
    }

    isAuth() {
        return this.auth.authState.pipe(
            //return true or false
            map(fbUser => fbUser != null)
        );
    }

}
