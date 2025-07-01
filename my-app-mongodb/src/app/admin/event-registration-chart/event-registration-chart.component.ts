import { Component, OnInit } from '@angular/core';
import { EventRegistrationApiService } from '../../event-registration-api.service';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-event-registration-chart',
  standalone: false,
  templateUrl: './event-registration-chart.component.html',
  styleUrl: './event-registration-chart.component.css'
})
export class EventRegistrationChartComponent  implements OnInit {
  constructor(private eventRegistrationApiService: EventRegistrationApiService) {}

  ngOnInit() {
    // Fetch data from API
    this.eventRegistrationApiService.getEventRegistration(1, 150).subscribe(response => {
      const data = response.data;
      this.createChart(data);
    });
  }

  createChart(data: any[]) {
    // Process data to get counts of Joined: 1 and Joined: 0 per EventID
    const eventCounts = data.reduce((acc, eventRegistration) => {
      const eventId = eventRegistration.EventID; 
      if (!acc[eventId]) {
        acc[eventId] = { joined: 0, notJoined: 0 };
      }
      if (eventRegistration.Joined === 1) {
        acc[eventId].joined++;
      } else {
        acc[eventId].notJoined++;
      }
      return acc;
    }, {});

    // Check and log the grouped eventCounts to ensure proper grouping
    console.log(eventCounts);

    // Prepare data for the bar chart
    const eventIds = Object.keys(eventCounts);  // Extract EventIDs (keys)
    const joinedCounts = eventIds.map(id => eventCounts[id].joined);  // Count of joined for each EventID
    const notJoinedCounts = eventIds.map(id => eventCounts[id].notJoined);  // Count of not joined for each EventID

    // Check and log the chart data for correctness
    console.log(eventIds, joinedCounts, notJoinedCounts);

    // Create the chart using Chart.js
    new Chart('eventChart', {
      type: 'bar',
      data: {
        labels: eventIds, // Event IDs
        datasets: [
          {
            label: 'Joined',
            data: joinedCounts,
            backgroundColor: 'green'
          },
          {
            label: 'Not Joined',
            data: notJoinedCounts,
            backgroundColor: 'red'
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
