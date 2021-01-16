import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../_service/auth_service';
import { ActivatedRoute, Routes, Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  form: any = {};
  id = 0;

  constructor(private authService: AuthService, public route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
  }

  onSubmit()
  {
    this.authService.verify(this.form, this.id).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['']);
      },
      err => {
      }
    );
  }

}
