import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from "rxjs/operators";
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userSubscription: Subscription;

    constructor(
        public auth: AngularFireAuth,
        private firestore: AngularFirestore,
        private store: Store<AppState>
    ) { }

    initAuthListener() {
        this.auth.authState.subscribe( fuser => {
            // console.log('fuser -> ', fuser);
            if (fuser) {
                this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
                    .subscribe( (firestoreUser:any) => {

                        console.log('firestoreUser ->', firestoreUser);

                        const user = Usuario.fromFirebase(firestoreUser)

                        // this.store.dispatch( authActions.setUser( { user: user } ) )
                        // es lo mismo que arriba
                        this.store.dispatch( authActions.setUser( { user } ) )
                    })
            } else {
                this.userSubscription.unsubscribe();
                this.store.dispatch( authActions.unSetUser())
            }
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
