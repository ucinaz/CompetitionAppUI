import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserInfoKayitComponent } from './user-info-kayit.component';

describe('UserInfoKayitComponent', () => {
    let component: UserInfoKayitComponent;
    let fixture: ComponentFixture<UserInfoKayitComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserInfoKayitComponent],
            imports: [ReactiveFormsModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserInfoKayitComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
