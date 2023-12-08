import Messages from './base/Messages';
import HTTPException from './base/HTTPException';

export default class NotFound extends HTTPException
{
    constructor(message?: string) {
        super(message || Messages.NOT_FOUND);
    }
    
}
