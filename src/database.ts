import { Sequelize } from "sequelize";

const sequelize = new Sequelize("Auction", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export { sequelize };
