import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { QuotationComponent } from './quotation/quotation.component';
import { BookReviewComponent } from './book-review/book-review.component';
import { EventReviewComponent } from './event-review/event-review.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { MembershipComponent } from './membership/membership.component';
import { EventRegistrationComponent } from './event-registration/event-registration.component';
import { CategoryComponent } from './category/category.component';
import { BookinfoComponent } from './bookinfo/bookinfo.component';
import { DiscountComponent } from './discount/discount.component';
import { EventComponent } from './event/event.component';
import { BookstockComponent } from './bookstock/bookstock.component';
import { LoginComponent } from '../login/login.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {  path: 'admin', 
    component: MainpageComponent, 
    canActivate: [AuthGuard],
    children:[
      {path:'discount', component:DiscountComponent, data: {title: 'Discount'}},
      {path:'quotation', component:QuotationComponent, data: {title: 'Quotation'}},
      {path:'bookreview', component:BookReviewComponent, data: {title: 'Book Review'}},
      {path:'eventreview', component:EventReviewComponent, data: {title: 'Event Review'}},
      {path:'delivery', component:DeliveryComponent, data: {title: 'Delivery'}},
      {path:'membership', component:MembershipComponent, data: {title: 'Membership'}},
      {path:'eventregistration', component:EventRegistrationComponent, data: {title: 'Event Registration'}},
      {path:'category', component:CategoryComponent, data: {title: 'Category'}},
      {path:'bookinfo', component:BookinfoComponent, data: {title: 'Book Info'}},
      {path:'event', component:EventComponent, data: {title: 'Event'}},
      {path:'order', component:SaleOrderComponent, data: {title: 'Order'}},
      {path:'bookstock', component:BookstockComponent, data: {title: 'Book Stock'}},
      {path:'', redirectTo: 'order', pathMatch: 'full' }
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
