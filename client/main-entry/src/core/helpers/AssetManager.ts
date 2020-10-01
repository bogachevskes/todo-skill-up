import * as fs from 'fs';
import * as path from 'path';

const PATH_SEPARATOR = '/';
const TYPE_JS   = 'js';
const TYPE_CSS  = 'css';

export default class AssetManager
{
    protected assetsPath: string;

    protected publicPath: string;

    protected type: string;

    protected buildName: string;

    protected fileNames: string[];

    protected linkTags: string[];
    
    constructor(dirName: string, type: string, publicPath: string = 'public', buildName: string = '')
    {
        this.assetsPath = path.join(
                path.dirname(require.main!.filename),
                publicPath,
                dirName
            );

        this.type = type;

        this.fileNames = [];

        this.publicPath =
            PATH_SEPARATOR +
            publicPath +
            PATH_SEPARATOR +
            dirName;

        if (buildName) {
            this.buildName = buildName;
        } else {
            this.buildName = dirName;
        }

        this.linkTags = [];
    }

    /**
     * Сбор имен файлов ассетов.
     * 
     * @return {void}
     */
    protected setFilesList(): void
    {
        const fileNames = fs.readdirSync(this.assetsPath);
        const buildExpr = new RegExp(`${this.buildName}.*\.${this.type}`);
        
        for (let fileName of fileNames) {
            if (buildExpr.test(fileName)) {
                this.fileNames.push(fileName);
            }
        }
    }

    /**
     * Создает тег файла ассета.
     * 
     * @param {string} fileName
     * @return {string}
     */
    protected generateTag(fileName): string
    {
        const
            jsExpr  = new RegExp(`\.${TYPE_JS}`),
            cssExpr = new RegExp(`\.${TYPE_CSS}`);

        if (jsExpr.test(fileName)) {
            return `<script type="text/javascript" src="./${fileName}"></script>`;
        } else if (cssExpr.test(fileName)) {
            return `<link href="./${fileName}" rel="stylesheet">`;
        }

        throw new Error("Tag can't be generated");
    }

    /**
     * Генерация тегов файлов ассетов.
     * 
     * @return {void}
     */
    protected renderTags(): void
    {
        for (let asset of this.fileNames) {
            let tag = this.generateTag(asset);
            
            this.linkTags.push(tag);
        }
    }
    
    /**
     * Возвращает тэги ассетов.
     * 
     * @param {string} dirName 
     * @param {string} type
     * @return {string}
     * @throws {Error}
     */
    public static getDirAssets(dirName, type = TYPE_JS): string
    {
        const model = new AssetManager(dirName, type);

        model.setFilesList();

        if (! model.fileNames.length) {
            throw new Error('Assets not found');
        }

        model.renderTags();

        return model
            .linkTags
            .join('');
    }
}