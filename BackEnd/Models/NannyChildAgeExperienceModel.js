export default (sequelize, DataTypes) => {
    const NannyChildAgeExperience = sequelize.define('NannyChildAgeExperience', {
      nanny_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Nanny_Profiles',
          key: 'nanny_id'
        }
      },
      age_group: {
        type: DataTypes.ENUM('babies', 'toddlers', 'children', 'teenagers'),
        allowNull: false,
        primaryKey: true,
        validate: {
          isIn: [['babies', 'toddlers', 'children', 'teenagers']]
        }
      }
    }, {
      tableName: 'Nanny_Child_Age_Experience',
      timestamps: false,
      underscored: true,
      freezeTableName: true
    });
  
    return NannyChildAgeExperience;
  };