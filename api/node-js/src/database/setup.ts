import { Sequelize } from 'sequelize-typescript';
import db from '../config/_db';

export default new Sequelize(
   db.database,
   db.user,
   db.password,
   {
       dialect: 'mysql',
       host: db.host,
       define: {
           underscored: true,
       },
       timezone: '+03:00',
    }
);