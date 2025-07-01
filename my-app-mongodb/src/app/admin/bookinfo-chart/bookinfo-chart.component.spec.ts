import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookinfoChartComponent } from './bookinfo-chart.component';

describe('BookinfoChartComponent', () => {
  let component: BookinfoChartComponent;
  let fixture: ComponentFixture<BookinfoChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookinfoChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookinfoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
