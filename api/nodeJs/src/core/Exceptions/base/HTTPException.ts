 
export default class HTTPException extends Error {
    public name: string;

    public data: any[];
  
    constructor(public status: number, public message: string, data: any[] = [], ...rest: any[]) {
      super(...rest);
  
      this.name = this.constructor.name;
      this.data = data;
    }

}
  