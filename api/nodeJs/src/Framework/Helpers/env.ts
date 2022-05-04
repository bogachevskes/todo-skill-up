import InvalidArgumentException from '../Exceptions/InvalidArgumentException';

export default (constant: string): any | never => {
    const environment = process.env[constant];
  
    if (environment === undefined) {
        throw new InvalidArgumentException(`The ${constant} constant is undefined`);
    }

    return environment;
};