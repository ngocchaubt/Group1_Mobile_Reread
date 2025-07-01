import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdminRoutingModule } from './admin-routing.module';
import { MainpageComponent } from './mainpage/mainpage.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuotationComponent } from './quotation/quotation.component';
import { BookReviewComponent } from './book-review/book-review.component';
import { EventReviewComponent } from './event-review/event-review.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { MembershipComponent } from './membership/membership.component';
import { EventRegistrationComponent } from './event-registration/event-registration.component';
import { CategoryComponent } from './category/category.component';
import { BookinfoComponent } from './bookinfo/bookinfo.component';
import { EventComponent } from './event/event.component';
import { DiscountComponent } from './discount/discount.component';
import { BookstockComponent } from './bookstock/bookstock.component';
import { SaleOrderChartComponent } from './sale-order-chart/sale-order-chart.component';
import { DiscountChartComponent } from './discount-chart/discount-chart.component';
import { DeliveryChartComponent } from './delivery-chart/delivery-chart.component';
import { MembershipChartComponent } from './membership-chart/membership-chart.component';
import { QuotationChartComponent } from './quotation-chart/quotation-chart.component';
import { BookinfoChartComponent } from './bookinfo-chart/bookinfo-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { BookstockChartComponent } from './bookstock-chart/bookstock-chart.component';
import { EventChartComponent } from './event-chart/event-chart.component';
import { EventRegistrationChartComponent } from './event-registration-chart/event-registration-chart.component';


@NgModule({
  declarations: [
    MainpageComponent,
    SaleOrderComponent,
    QuotationComponent,
    BookReviewComponent,
    EventReviewComponent,
    DeliveryComponent,
    MembershipComponent,
    EventRegistrationComponent,
    CategoryComponent,
    BookinfoComponent,
    EventComponent,
    DiscountComponent,
    BookstockComponent,
    SaleOrderChartComponent,
    DiscountChartComponent,
    DeliveryChartComponent,
    MembershipChartComponent,
    QuotationChartComponent,
    BookinfoChartComponent,
    BookstockChartComponent,
    EventChartComponent,
    EventRegistrationChartComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    NgxChartsModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
