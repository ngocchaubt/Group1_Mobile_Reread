import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookstockChartComponent } from './bookstock-chart.component';

describe('BookstockChartComponent', () => {
  let component: BookstockChartComponent;
  let fixture: ComponentFixture<BookstockChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookstockChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookstockChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
