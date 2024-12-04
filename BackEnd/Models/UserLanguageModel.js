export default (sequelize, DataTypes) => {
    return sequelize.define('User_Language', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'user_id'
            }
        },
        language_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Languages',
                key: 'language_id'
            }
        }
    }, {
        tableName: 'User_Language',
        timestamps: false
    });
};