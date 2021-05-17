import SetRole from '../app/console/commands/SetRole';
import UnsetRole from '../app/console/commands/UnsetRole';
import SetRolePermission from '../app/console/commands/SetRolePermission';
import SeedData from '../app/console/commands/SeedData';

export default {
    'set:role': SetRole,
    'unset:role': UnsetRole,
    'set:permission': SetRolePermission,
    'migration:seed': SeedData,
};