import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-data-grid',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.css'],
})
export class MainPageTest implements OnInit {
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {}
}
