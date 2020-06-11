import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  constructor(private auth: AuthenticationService, private route: Router) {}

  ngOnInit(): void {}

  logout() {
    this.auth.signOut().subscribe((data) => {
      this.route.navigateByUrl('/');
    });
  }
}
