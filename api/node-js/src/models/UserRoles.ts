import Roles from './Roles';
import User from './User';
import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';

@Table
export default class UserRoles extends Model<UserRoles>
{

    @ForeignKey(() => Roles)
    @Column
    roleId: number;
  
    @ForeignKey(() => User)
    @Column
    userId: number;

}
