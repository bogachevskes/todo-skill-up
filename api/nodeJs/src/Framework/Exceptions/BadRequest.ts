import Messages from './base/Messages';
import HTTPException from './base/HTTPException';

export default class BadRequest extends HTTPException
{
    constructor(message?: string, data: any[] = []) {
        super(message || Messages.BAD_REQUEST, data);
    }
    
}
