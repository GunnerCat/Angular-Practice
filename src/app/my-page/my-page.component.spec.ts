import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageTest } from './my-page.component';

describe('MainPageTest', () => {
  let component: MainPageTest;
  let fixture: ComponentFixture<MainPageTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainPageTest],
    }).compileComponents();

    fixture = TestBed.createComponent(MainPageTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
