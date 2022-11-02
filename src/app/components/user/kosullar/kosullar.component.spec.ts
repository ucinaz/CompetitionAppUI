import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KosullarComponent } from './kosullar.component';

describe('KatilimComponent', () => {
  let component: KosullarComponent;
  let fixture: ComponentFixture<KosullarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KosullarComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KosullarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
