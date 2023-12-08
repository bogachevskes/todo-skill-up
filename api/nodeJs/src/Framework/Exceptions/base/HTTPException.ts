 
export default class HTTPException extends Error {
    public type: string;

    public data: any[];

    public cause: string;
  
    constructor(message, data: any[] = []) {
      super(message);

      this.cause = message;
      this.type = this.constructor.name;
      this.data = data;
    }

}
  