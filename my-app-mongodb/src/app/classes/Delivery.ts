export class Delivery {
    constructor(
    public _id?: any, 
    public OrderID: string = "",
    public Address: string="",
    public TrackingNumber: number=0,
    public CarrierName: string = "",
    public ShipmentStatus: string="",
    public ShippedDate: string="",
    public EstimatedDeliveryDate: string="",
    public ActualDeliveryDate: string=""
    ) {}
}
