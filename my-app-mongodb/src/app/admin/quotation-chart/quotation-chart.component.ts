import { Component, OnInit } from '@angular/core';
import { QuotationApiService } from '../../quotation-api.service';
import { colorSets } from '@swimlane/ngx-charts';
import { Color } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-quotation-chart',
  standalone: false,
  templateUrl: './quotation-chart.component.html',
  styleUrl: './quotation-chart.component.css'
})
export class QuotationChartComponent implements OnInit {
  quotationData: any[] = [];
  view: [number, number] = [500, 250];

  showLegend = true;
  showLabels = true;
  gradient = false;

  // Cách 1: Đặt giá trị mặc định nếu không tìm thấy màu
  colorScheme: Color = colorSets.find(s => s.name === 'vivid') || colorSets[0];

  constructor(private quotationService: QuotationApiService) {}

  ngOnInit(): void {
    this.loadQuotations();
  }

  loadQuotations(): void {
    this.quotationService.getQuotation(1, 100).subscribe(response => {
      const statusCount: { [key: string]: number } = {};

      response.data.forEach(quotation => {
        const status = quotation.QuotStatus;
        statusCount[status] = (statusCount[status] || 0) + 1;
      });

      this.quotationData = Object.keys(statusCount).map(status => ({
        name: status,
        value: statusCount[status]
      }));
    });
  }
}
