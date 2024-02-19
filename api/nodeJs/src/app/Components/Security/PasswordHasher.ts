import bcrypt from 'bcryptjs';

export default class PasswordHasher
{
    public async hash(input: string, length: number = 12): Promise<string>
    {
        return await bcrypt.hash(
            input,
            length
        );
    }

    public async verify(input: string, hash: string): Promise<boolean>
    {
        return await bcrypt.compare(input, hash);
    }
}