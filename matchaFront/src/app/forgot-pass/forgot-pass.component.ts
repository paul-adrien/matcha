import { Component, OnInit } from "@angular/core";
import { AuthService } from "../_service/auth_service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-forgot-pass",
  templateUrl: "./forgot-pass.component.html",
  styleUrls: ["./forgot-pass.component.scss"],
})
export class ForgotPassComponent implements OnInit {
  form: any = {};

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.authService.forgotPass_s(this.form).subscribe(
      data => {
        if (data.status == true) {
          console.log(data);
          this.router.navigate(["login"]);
        } else {
          console.log(data);
        }
      },
      err => {
        this.router.navigate(["/maintenance"]);
      }
    );
  }
}
