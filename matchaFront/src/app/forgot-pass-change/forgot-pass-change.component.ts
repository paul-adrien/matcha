import { Component, OnInit } from "@angular/core";
import { AuthService } from "../_service/auth_service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-forgot-pass-change",
  templateUrl: "./forgot-pass-change.component.html",
  styleUrls: ["./forgot-pass-change.component.scss"],
})
export class ForgotPassChangeComponent implements OnInit {
  form: any = {};
  id = 0;

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
  }

  onSubmit() {
    this.authService.forgotPass_c(this.form, this.id).subscribe(
      data => {
        if (data.status == true) {
          this.router.navigate(["login"]);
        } else {
        }
      },
      err => {
        this.router.navigate(["/maintenance"]);
      }
    );
  }
}
