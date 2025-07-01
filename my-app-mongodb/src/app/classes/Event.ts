export class Event {
    constructor(
        public _id?: string,
        public EventID: string = "",
        public EventName: string = "",
        public EventType: string = "",
        public EventStart: string = "",
        public EventEnd: string = "",
        public EventDesc: string[] = [],  
        public EventLoc: string = "",    
        public EventCpct: number = 0,   
        public Img: string = ""        
    ) {}
}
export interface CreateEvent {
    EventID: string;
    EventName: string;
    EventType: string;
    EventStart: string;
    EventEnd: string;
    EventDesc: string[];  
    EventLoc: string;   
    EventCpct: number;
    Img: string;
}

export interface MyEvent {
    EventID: string;
    EventName: string;
    EventType: string;
    EventStart: string;
    EventEnd: string;
    EventDesc: string[];  
    EventLoc: string;   
    EventCpct: number;
    Img: string;
}