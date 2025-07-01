import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountChartComponent } from './discount-chart.component';

describe('DiscountChartComponent', () => {
  let component: DiscountChartComponent;
  let fixture: ComponentFixture<DiscountChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscountChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
