import Executable from '../../base/Executable';
import CommandContext from '../../base/CommandContext';
import FileParameters from './renderer/FileParameters';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

export default class RenderCommand implements Executable
{
    protected viewsPath: string;

    protected outputPath: string;
    
    protected filename: string;

    protected parameters: any[];

    protected fileParameters: FileParameters;

    public constructor()
    {
        this.viewsPath = path.resolve(__dirname, '../', '../', '../src/views');
        this.outputPath = path.resolve(__dirname, '../', '../public');
        
        this.fileParameters = new FileParameters;
    }

    protected setFileName(context: CommandContext): void
    {
        this.filename = context.get('fileName');
    }

    protected setParameters()
    {
        this.parameters = this.fileParameters.get(this.filename);
    }

    protected render(): void
    {
        const
            templatePath    = path.resolve(this.viewsPath, this.filename),
            template        = fs.readFileSync(templatePath + '.ejs', 'utf-8'),
            html            = ejs.render(template , this.parameters),
            outputFile      = path.resolve(this.outputPath, this.filename + '.html');
        
        fs.writeFileSync(outputFile, html, 'utf8');
    }
    
    public execute(context: CommandContext): void
    {
        this.setFileName(context);

        this.setParameters();

        this.render();
    }

}
