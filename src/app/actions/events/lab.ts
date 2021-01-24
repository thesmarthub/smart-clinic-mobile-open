export abstract class LabEvents {
  constructor(private event) {
    this.eventLogger();
  }

  eventLogger() {
    console.log(typeof this.event);
  }
}

export class LoadLabRequests extends LabEvents {}
