 
export default class HTTPException extends Error {
    public name: string;
  
    constructor(public status: number, public message: string, ...rest: any[]) {
      super(...rest);
  
      this.name = this.constructor.name;
    }

}
  