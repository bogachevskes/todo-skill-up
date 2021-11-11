import Messages from './base/Messages';
import HTTPException from './base/HTTPException';
import Codes from '../../config/codes';

export default class NotFound extends HTTPException
{
    constructor(message?: string, ...rest: any[]) {
        super(Codes.CODE_NOT_FOUND, message || Messages.NOT_FOUND, ...rest);
    }
    
}
