const { Sequelize } = require('sequelize');

// Substitua pelos seus próprios dados de conexão
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite', // ou 'postgres', 'sqlite', etc.
});

// Verifique a conexão
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;


// Importar os modelos
const Task = require('./models/task');
const Category = require('./models/category');
const ListaCompras = require('./models/ListaCompras');

// Sincronizar o banco de dados
async function syncDatabase() {
  try {
    await sequelize.sync({ force: false }); // Altere para true se precisar recriar as tabelas
    console.log('Banco de dados sincronizado corretamente!');
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
  }
}


syncDatabase();

module.exports = sequelize;
