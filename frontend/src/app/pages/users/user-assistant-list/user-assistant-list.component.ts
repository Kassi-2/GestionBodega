import { Component, OnDestroy, OnInit } from '@angular/core';
import { Assistant, UserAssitant } from '../../../core/models/user.interface';
import { UserService } from '../../../core/services/user.service';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-user-assistant-list',
  standalone: true,
  imports: [UserOptionsComponent, AddUserComponent],
  templateUrl: './user-assistant-list.component.html',
  styleUrl: './user-assistant-list.component.css',
  providers: [UserService],
})
export class UserAssistantListComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.getAllAssistants();
  }
  ngOnDestroy(): void {}

  public assistants!: UserAssitant[];

  public getAllAssistants() {
    this.userService
      .getALLAssistants()
      .subscribe((assistants: UserAssitant[]) => {
        this.assistants = assistants;
      });
  }
}
