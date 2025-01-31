export default {
    HOST: 'localhost',  // ou '127.0.0.1'
    USER: 'root',
    PASSWORD: '',
    DB: 'nannyexpress',
    dialect: 'mysql',
    
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}