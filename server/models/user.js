module.exports = (sequelize, DataTypes) =>{
  const user = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['male', 'female']]
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    grNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  },
  {
    timestamps: false,
  });

  user.associate = (models) => {
    user.belongsTo(models.roles, {
      foreignKey: 'role',
      as: 'roles',
      onDELETE: 'CASCADE',
    });

    user.hasMany(models.leaveRequests, {
      foreignKey: 'userId',
      as: 'leaves',
      onDELETE: 'CASCADE',
    });

    user.hasMany(models.leaveRequests, {
      foreignKey: 'requestToId',
      as: 'leaveRequests',
      onDELETE: 'CASCADE',
    });

    user.hasOne(models.userLeaves, {
      foreignKey: 'userId',
      as: 'leaveBalance',
      onDELETE: 'CASCADE',
    });
  };
  
  return user;
}