import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        })
    }

    loginUsuario() {

        if (this.loginForm.invalid) { return; }

        Swal.fire({
            title: 'Loading',
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        })

        const { email, password } = this.loginForm.value;

        this.authService.loginUsuario(email, password)
            .then(credenciales => {
                console.log('credenciales ->', credenciales);
                Swal.close();
                this.router.navigate(['/']);
            })
            .catch(err => {
                // Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.message
                })
            })

    }

}
