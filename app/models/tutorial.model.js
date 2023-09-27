module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("tutorial", {
    user: {
      type: Sequelize.STRING
    },
    tipo_user: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return Tutorial;
};
