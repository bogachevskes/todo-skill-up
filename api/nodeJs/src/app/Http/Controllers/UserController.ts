import { Request, Response } from 'express';
import Controller from '../../../Framework/Http/Controller/Controller';
import AutoBind from '../../../Framework/Decorators/AutoBind';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import UserRepository from '../../../app/Repository/UserRepository';
import MatchUsersByEmailRequest from '../../../app/FormRequest/User/MatchUsersByEmailRequest';

export default class UserController extends Controller
{
    /**
     * @param  req Request
     * @param  res Response
     * @return Response
     */
    @AutoBind
    public async actionMatchUsersByEmail(req: Request, res: Response): Promise<Response>
    {
        const formRequest = new MatchUsersByEmailRequest(req.params);

        await formRequest.validate();

        if (formRequest.isNotValid()) {
            
            throw new BadRequest(formRequest.getFirstError());
        }
        
        return res.json({
            items: await UserRepository.getUsersByEmailEntry(formRequest.email, 20),
        });
    }
}