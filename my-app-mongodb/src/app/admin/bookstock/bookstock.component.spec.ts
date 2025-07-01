import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookstockComponent } from './bookstock.component';

describe('BookstockComponent', () => {
  let component: BookstockComponent;
  let fixture: ComponentFixture<BookstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookstockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
