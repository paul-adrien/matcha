import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '@matcha/shared';
import { profilService } from '../_service/profil_service';

@Component({
  selector: 'discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
  @Input() user: User;

  public usersViews = [];
  public userslike = [];

  constructor(private profilService: profilService) { }

  ngOnInit(): void {
    this.profilService.takeViewProfil(this.user.id).subscribe(
      data => {
        console.log(data);
        if (data.status === true) {
          this.usersViews = data.users;
        }
      },
      err => {
      }
    );
    this.profilService.whoLikeMe(this.user.id).subscribe(
      data => {
        console.log(data);
        if (data.status === true) {
          this.userslike = data.users;
        }
      },
      err => {
      }
    );
  }

}