import Messages from './base/Messages';
import HTTPException from './base/HTTPException';
import Codes from '../../config/codes';

export default class Forbidden extends HTTPException
{
    constructor(message?: string, ...rest: any[]) {
        super(Codes.CODE_FORBIDDEN, message || Messages.FORBIDDEN, ...rest);
    }
    
}
