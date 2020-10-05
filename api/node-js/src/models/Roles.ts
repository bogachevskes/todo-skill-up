import User from './User';
import UserRoles from './UserRoles';
import { Table, Column, Model, Length, Index, BelongsToMany } from 'sequelize-typescript';

@Table
export default class Roles extends Model<Roles>
{

    @Index({unique: true})
    @Length({min: 1, max: 100})
    @Column
    name: string;

    @BelongsToMany(() => User, () => UserRoles)
    users?: User[];

}
