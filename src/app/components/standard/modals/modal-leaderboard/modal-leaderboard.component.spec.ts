import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLeaderboard } from './modal-leaderboard.component';

describe('ModalAtSecComponent', () => {
  let component: ModalLeaderboard;
  let fixture: ComponentFixture<ModalLeaderboard>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalLeaderboard]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLeaderboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
