import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipChartComponent } from './membership-chart.component';

describe('MembershipChartComponent', () => {
  let component: MembershipChartComponent;
  let fixture: ComponentFixture<MembershipChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MembershipChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
