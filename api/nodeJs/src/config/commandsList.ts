import SetRole from '../app/Console/Commands/SetRole';
import UnsetRole from '../app/Console/Commands/UnsetRole';
import SetRolePermission from '../app/Console/Commands/SetRolePermission';
import SeedData from '../app/Console/Commands/SeedData';

export default {
    'set:role': SetRole,
    'unset:role': UnsetRole,
    'set:permission': SetRolePermission,
    'migration:seed': SeedData,
};