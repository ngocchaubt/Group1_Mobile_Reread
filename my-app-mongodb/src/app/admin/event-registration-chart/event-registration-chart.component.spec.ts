import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRegistrationChartComponent } from './event-registration-chart.component';

describe('EventRegistrationChartComponent', () => {
  let component: EventRegistrationChartComponent;
  let fixture: ComponentFixture<EventRegistrationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventRegistrationChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventRegistrationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
