export default  {
    HOST: '145.223.103.28',
    USER: 'root',
    PASSWORD: '',
    DB: 'nannyexpress',
    dialect: 'mysql',
    
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
}

