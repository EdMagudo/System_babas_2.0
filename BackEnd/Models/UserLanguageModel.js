export default (sequelize, DataTypes) => {
    return sequelize.define('User_Language', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        }
    }, {
        tableName: 'User_Language',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'language']
            }
        ]
    });
};
