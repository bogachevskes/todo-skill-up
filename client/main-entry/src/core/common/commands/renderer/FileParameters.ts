import AssetManager from '../../../helpers/AssetManager';

export default class FileParameters
{
    protected getParameters()
    {
        return {
            'index': {
                CssAssets: AssetManager.getDirAssets('', 'css'),
                JsAssets: AssetManager.getDirAssets('', 'js'),
            },
        };
    }

    public get(filename: string)
    {
        const parameters = this.getParameters();
        
        if (! (filename in parameters)) {
            throw new Error(`Parameters of file ${filename} not found`);
        }

        return parameters[filename];
    }
}