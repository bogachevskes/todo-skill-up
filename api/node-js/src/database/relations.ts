import User from '../models/User';
import Roles from '../models/Roles';
import UserRoles from '../models/UserRoles';

export const defineRelations = () => {
    Roles.belongsToMany(User, { through: UserRoles });
    User.belongsToMany(Roles, { through: UserRoles });

    return true;
}