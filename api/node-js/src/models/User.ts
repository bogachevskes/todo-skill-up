import Roles from './Roles';
import {Table, Column, Model, HasMany ,Length, Default, Index} from 'sequelize-typescript';

@Table
export default class User extends Model<User> {

    @Index
    @Column
    name: string;

    @Index({unique: true})
    @Column
    email: string;

    @Index
    @Column
    password: string;

    @Index
    @Length({min: 1, max: 1})
    @Default(1)
    @Column
    status: number;

    @HasMany(() => Roles)
    roles: Roles[]
}