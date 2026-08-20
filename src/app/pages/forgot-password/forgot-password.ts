import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
    private fb            = inject(FormBuilder);
    private authService   = inject(AuthService);
    private router        = inject(Router);
    private toastr        = inject(ToastrService);
    isProcessing          = false;
    private chdr          = inject(ChangeDetectorRef);
    
    step: 1 | 2 = 1;

    forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  // Form for Step 2: Verification Code & New Password
  resetForm: FormGroup = this.fb.group(
    {
      code: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );


  // Custom validator to check if passwords match
  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Step 1: Send reset code to email
  onSubmitEmail() {
    if (this.forgotForm.invalid) return;

    this.isProcessing = true;
    const email = this.forgotForm.value.email;

    // Call your auth service API
    this.authService.forgotPasswordEmail(email).subscribe({
      next: (response) => {
        console.log("this.authService.forgotPasswordEmail");
        console.log('FORGOT PASSWORD RESPONSE:', response);
        this.isProcessing = false;
        this.step = 2; // Switch form step
        this.toastr.success('Verification code sent to your email.');
        this.chdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.isProcessing = false;
        this.toastr.error(err?.error?.message || 'Failed to send reset code.');
        this.chdr.detectChanges();
      },
    });
  }

  // Step 2: Verify code and set new password
  onSubmitReset() {
    if (this.resetForm.invalid) return;
      this.isProcessing = true;
      this.authService.resetPassword(this.forgotForm.value.email, this.resetForm.value.code, this.resetForm.value.password ).subscribe({
        next: () => {
          this.isProcessing = false;
          this.toastr.success('Password reset successfully. Please log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log(err);
          this.isProcessing = false;
          this.toastr.error(err?.error?.message || 'Invalid code or request failed.');
          this.chdr.detectChanges();
        },
      });
  }

  // Resend code action
  onResendCode() {
    if (this.forgotForm.invalid) return;
    this.authService.forgotPasswordEmail(this.forgotForm.value.email).subscribe({
      next: () => this.toastr.success('Code resent to your email.'),
      error: () => this.toastr.error('Failed to resend code.'),
    });
  }
  
  
}
