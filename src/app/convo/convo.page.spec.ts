import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConvoPage } from './convo.page';

describe('ConvoPage', () => {
  let component: ConvoPage;
  let fixture: ComponentFixture<ConvoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConvoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
