import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyChoicesComponent } from './my-choices.component';

describe('RegisterComponent', () => {
  let component: MyChoicesComponent;
  let fixture: ComponentFixture<MyChoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyChoicesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyChoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
