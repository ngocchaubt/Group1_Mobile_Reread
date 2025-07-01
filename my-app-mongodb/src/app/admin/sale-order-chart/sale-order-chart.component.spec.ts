import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderChartComponent } from './sale-order-chart.component';

describe('SaleOrderChartComponent', () => {
  let component: SaleOrderChartComponent;
  let fixture: ComponentFixture<SaleOrderChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleOrderChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleOrderChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
