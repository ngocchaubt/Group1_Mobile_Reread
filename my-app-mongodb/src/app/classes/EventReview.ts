export class EventReview {
    constructor(
    public _id?: any, 
    public ReviewID: string = "",
    public EventID: string = "",
    public UserID: string = "",
    public Rating: number = 0,
    public Comment: string = "",
    public ReviewDate: string = "",
    ) {}
}
