import Messages from './base/Messages';
import HTTPException from './base/HTTPException';
import Codes from '../../config/codes';

export default class InternalServerError extends HTTPException
{
    constructor(message?: string, ...rest: any[]) {
        super(Codes.CODE_INTERNAL_SERVER_ERROR, message || Messages.INTERNAL_SERVER_ERROR, ...rest);
    }
    
}
