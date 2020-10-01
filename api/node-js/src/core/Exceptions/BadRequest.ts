import Messages from './base/Messages';
import HTTPException from './base/HTTPException';
import Codes from '../../config/codes';

export default class BadRequest extends HTTPException
{
    constructor(message?: string, ...rest: any[]) {
        super(Codes.CODE_BAD_REQUEST, message || Messages.BAD_REQUEST, ...rest);
    }
    
}
