import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { email } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  isProcessing = false;
  private chdr    = inject(ChangeDetectorRef);
  
  loginForm: FormGroup= this.fb.group({
    email:['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  onSubmit(){
    
    if(this.loginForm.valid){
      this.isProcessing = true;
      /////////////
      this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (response: any) => {
          this.isProcessing = true;
          this.authService.login(response.accessToken, response);
          this.toastr.success("Login successfull!");
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isProcessing = false;
          this.toastr.error(err.error?.message || 'Invalid credentials');
          this.chdr.detectChanges();       
        }
      })
      /////////////
    }else{
      this.toastr.warning('Please fill in the form correctly.');
    }
  }

}
