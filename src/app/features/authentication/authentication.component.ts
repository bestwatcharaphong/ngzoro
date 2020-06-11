import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { generateSalt } from 'src/app/shared/operators/crypto.operator';
import { Ticket } from 'src/app/shared/models/auth.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
  loginForm: FormGroup;
  verifying: boolean;
  isLoading = true;
  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Step 1: Check is login
    // Step 1.1: (y) - redirect to home
    // Step 1.2: (n) - show login form

    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    this.verifying = true;
    this.auth
      .isAuthorizedAccess()
      .then((r) => {
        console.log(r);
        if (r) {
          // this.isAdmin = true;
          this.router.navigateByUrl('/importer');
        }
      })
      .finally(() => (this.verifying = false));
  }
  // if (this.authService.isAuthorizedAccess()) {
  //   this.router.navigateByUrl('/importer');
  // } else {
  //   this.isLoading = false;
  // }

  submitLogin() {
    // tslint:disable-next-line:forin
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    const salt = generateSalt(32);
    this.auth.getTicket(salt).subscribe((data) => {
      console.log(data.result);
      const t = data.result as Ticket;
      this.auth
        .signIn(
          this.loginForm.controls.username.value as string,
          this.loginForm.controls.password.value as string,
          salt,
          t
        )
        .subscribe(
          (r) => {
            console.log(r);
            localStorage.setItem(
              'username',
              this.loginForm.controls.username.value as string
            );
            this.msg.create('success', `การเข้าสู่ระบบสำเร็จ`);
            this.router.navigateByUrl('/importer');
          },
          (err) => {
            let msg = '';
            if (err.error.error === 'no permission to access') {
              msg = 'คุณไม่มีสิทธิ์เข้าถึง กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์';
            } else if (err.error.error === 'sign in error') {
              msg =
                'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบชื่อผู้ใช้งานและรหัสผ่านของคุณ';
            } else {
              msg = 'ระบบมีปัญหากรุณาติดต่อผู้ดูแลระบบ';
            }
            this.msg.create('error', msg);

            console.log(err);
          }
        );
    });
  }
}
