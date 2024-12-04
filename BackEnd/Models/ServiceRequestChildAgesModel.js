export default (sequelize, DataTypes) => {
    return sequelize.define('Service_Request_Child_Ages', {
        request_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Service_Requests',
                key: 'request_id'
            }
        },
        age_group: {
            type: DataTypes.ENUM('babies', 'toddlers', 'children', 'teenagers'),
            primaryKey: true,
            allowNull: false
        }
    }, {
        tableName: 'Service_Request_Child_Ages',
        timestamps: false
    });
};