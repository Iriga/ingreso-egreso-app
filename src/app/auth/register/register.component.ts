import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

    registroForm: FormGroup;
    loading: boolean = false;
    uiSubscription: Subscription;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private store: Store<AppState>
    ) { }

    ngOnInit(): void {
        this.registroForm = this.fb.group({
            nombre: ['', Validators.required],
            correo: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]

        })

        this.uiSubscription = this.store.select('ui').subscribe(ui => {
            this.loading = ui.isLoading
            console.log('cargando ->Registro');
        })

    }

    ngOnDestroy() {
        this.uiSubscription.unsubscribe();
    }

    crearUsuario() {

        if (this.registroForm.invalid) { return; }

        this.store.dispatch(ui.isLoading())


        // Swal.fire({
        //     title: 'Loading',
        //     onBeforeOpen: () => {
        //         Swal.showLoading()
        //     },
        // })

        const { nombre, correo, password } = this.registroForm.value;
        this.authService.crearUsuario(nombre, correo, password)
            .then(credenciales => {
                // console.log('credenciales ->', credenciales);
                // Swal.close();
                this.store.dispatch(ui.stopLoading());
                this.router.navigate(['/']);
            })
            .catch(err => {
                this.store.dispatch(ui.stopLoading());
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.message
                })
            })

    }

}
