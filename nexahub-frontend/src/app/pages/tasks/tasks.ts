import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks {

}