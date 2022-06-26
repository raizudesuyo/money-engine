export enum PollPriority {
  LOW, // Once every 10 minutes
  MEDIUM, // Once every 2 minutes
  HIGH, // Once every minute
  VERY_HIGH,// Once every 2 seconds
  CRITICAL // Once every half a sec

}

export class PollPriorityTime {
  static getTime(priority: PollPriority): number {
    switch(priority) {
      case PollPriority.LOW: return 600000;
      case PollPriority.MEDIUM: return 120000;
      case PollPriority.HIGH: return 60000;
      case PollPriority.VERY_HIGH: return 2000;
      case PollPriority.CRITICAL: return 500;      
    }
  }

  static deltaToPriority(delta: number){
    if(delta > 20) return PollPriority.LOW;
    if(delta > 15) return PollPriority.MEDIUM;
    if(delta > 10) return PollPriority.HIGH;
    if(delta > 5) return PollPriority.VERY_HIGH;
    return PollPriority.CRITICAL;
  }
}