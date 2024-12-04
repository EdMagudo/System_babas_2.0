export default (sequelize, DataTypes) => {
    return sequelize.define('Nanny_Profiles', {
        nanny_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            unique: true
        },
        education_level: {
            type: DataTypes.ENUM(
                'none', 
                'high_school_student', 
                'high_school_incomplete', 
                'high_school_complete', 
                'technical_student', 
                'technical_graduate', 
                'university_graduate'
            ),
            allowNull: false
        },
        job_type: {
            type: DataTypes.ENUM('full_time', 'temporary'),
            allowNull: false
        },
        experience_years: {
            type: DataTypes.ENUM('none', '1-2', '3-5', '5+'),
            allowNull: false
        },
        has_criminal_record: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        special_needs_experience: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        background_check_status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending'
        },
        additional_info: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'Nanny_Profiles',
        timestamps: false
    });
};