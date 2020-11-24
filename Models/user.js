module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    fullName: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    skills: {
      type: Sequelize.TEXT,
      get() {
        return this.getDataValue('skills').split(',');
      },
      set(val) {
        this.setDataValue('skills', val.join(','));
      },
    },
  });
  return User;
};
