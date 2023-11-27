import { Request, Response } from 'express';
import AutoBind from '../../Decorators/AutoBind';
import Forbidden from "../../Exceptions/Forbidden";
import Codes from "../../Exceptions/base/Codes";

export default abstract class CrudController
{
    protected list(req: Request): Promise<any[]>|never
    {
        return this.throwDefaultForbidden();
    }

    protected listItem(id: number, req: Request): Promise<object|[]>|never
    {
        return this.throwDefaultForbidden();
    }

    protected create(req: Request): Promise<void|object>|never
    {
        return this.throwDefaultForbidden();
    }

    protected update(id: number, req: Request): Promise<void>|never
    {
        return this.throwDefaultForbidden();
    }

    protected patch(id: number, req: Request): Promise<void>|never
    {
        return this.throwDefaultForbidden();
    }

    protected delete(id: number, req: Request): Promise<void>
    {
        return this.throwDefaultForbidden();
    }

    private throwDefaultForbidden(): never
    {
        throw new Forbidden('Доступ запрещен');
    }

    @AutoBind
    public async actionList(req: Request, res: Response): Promise<Response>
    {
        return res.json(await this.list(req));
    }

    @AutoBind
    public async actionListItem(req: Request, res: Response): Promise<Response>
    {
        const id: number = parseInt(req.params.id);

        return res.json(await this.listItem(id, req));
    }

    @AutoBind
    public async actionCreate(req: Request, res: Response): Promise<void>
    {
        const result: void|object = await this.create(req);

        res.status(Codes.CODE_CREATED);

        if (typeof result === 'object') {
            res.json(result);
            return;
        }

        res.send();
    }

    @AutoBind
    public async actionUpdate(req: Request, res: Response): Promise<void>
    {
        const id: number = parseInt(req.params.id);

        await this.update(id, req);

        res.status(Codes.CODE_OK);

        res.send();
    }

    @AutoBind
    public async actionPatch(req: Request, res: Response): Promise<void>
    {
        const id: number = parseInt(req.params.id);

        await this.patch(id, req);

        res.status(Codes.CODE_OK);

        res.send();
    }

    @AutoBind
    public async actionDelete(req: Request, res: Response): Promise<void>
    {
        const id: number = parseInt(req.params.id);

        await this.delete(id, req);

        res.status(Codes.CODE_NO_CONTENT);

        res.send();
    }
}
