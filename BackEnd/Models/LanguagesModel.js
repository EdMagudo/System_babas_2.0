export default (sequelize, DataTypes) => {
    return sequelize.define('Languages', {
        language_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        language_name: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false
        }
    }, {
        tableName: 'Languages',
        timestamps: false
    });
};