import Messages from './base/Messages';
import HTTPException from './base/HTTPException';

export default class Unauthorized extends HTTPException
{
    constructor(message?: string) {
        super(message || Messages.UNAUTHORIZED);
    }

}