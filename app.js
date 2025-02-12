const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const sequelize = require('./database');
const Task = require('./models/task');
const Category = require('./models/category');
const ListaCompras = require('./models/ListaCompras');
const Meta = require('./models/meta');
const Habito = require('./models/habito');
const evento = require('./models/evento');

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');


sequelize.sync({ force: false }).then(() => {
  console.log('Database synced!');
});



app.get('/eventos', async (req, res) => {
  let eventos = await Evento.findAll();
  eventos = eventos.map((evento) => evento.dataValues);

  res.render('evento/index', { eventos });  
});


app.get('/eventos/create', (req, res) => {
  res.render('evento/create');  
});


app.post('/eventos/create', async (req, res) => {
  const { nome, descricao, data } = req.body;
  await Evento.create({ nome, descricao, data });
  res.redirect('/eventos');
});


app.get('/eventos/edit/:id', async (req, res) => {
  let evento = await Evento.findByPk(req.params.id);
  if (!evento) return res.status(404).send('Evento não encontrado');

  res.render('evento/edit', { evento: evento.dataValues });  
});


app.post('/eventos/edit/:id', async (req, res) => {
  const { nome, descricao, data, status } = req.body;
  await Evento.update(
    { nome, descricao, data, status: status === 'on' },
    { where: { id: req.params.id } }
  );
  res.redirect('/eventos');
});


app.get('/eventos/delete/:id', async (req, res) => {
  await Evento.destroy({ where: { id: req.params.id } });
  res.redirect('/eventos');
});

app.get('/habitos', async (req, res) => {
  let habitos = await Habito.findAll();
  habitos = habitos.map((habito) => habito.dataValues);

  res.render('habito/index', { habitos });
});


app.get('/habitos/create', (req, res) => {
  res.render('habito/create');
});


app.post('/habitos/create', async (req, res) => {
  const { nome, descricao } = req.body;
  await Habito.create({ nome, descricao });
  res.redirect('/habitos');
});


app.get('/habitos/edit/:id', async (req, res) => {
  let habito = await Habito.findByPk(req.params.id);
  if (!habito) return res.status(404).send('Hábito não encontrado');
  
  res.render('habito/edit', { habito: habito.dataValues });
});


app.post('/habitos/edit/:id', async (req, res) => {
  const { nome, descricao, status } = req.body;
  await Habito.update(
    { nome, descricao, status: status === 'on' },
    { where: { id: req.params.id } }
  );
  res.redirect('/habitos');
});


app.get('/habitos/delete/:id', async (req, res) => {
  await Habito.destroy({ where: { id: req.params.id } });
  res.redirect('/habitos');
});


app.post('/habitos/mark/:id', async (req, res) => {
  let habito = await Habito.findByPk(req.params.id);
  if (!habito) return res.status(404).send('Hábito não encontrado');

  habito.status = !habito.status;
  await habito.save();

  res.redirect('/habitos');
});


app.get('/metas', async (req, res) => {
  let metas = await Meta.findAll();
  metas = metas.map((meta) => meta.dataValues);

  res.render('meta/index', { metas });
});


app.get('/metas/create', (req, res) => {
  res.render('meta/create');
});


app.post('/metas/create', async (req, res) => {
  const { nome, descricao } = req.body;
  await Meta.create({ nome, descricao });
  res.redirect('/metas');
});


app.get('/metas/edit/:id', async (req, res) => {
  let meta = await Meta.findByPk(req.params.id);
  meta = meta.dataValues;

  res.render('meta/edit', { meta });
});


app.post('/metas/edit/:id', async (req, res) => {
  const { nome, descricao, concluida } = req.body;
  await Meta.update(
    { nome, descricao, concluida: concluida === 'on' },
    { where: { id: req.params.id } }
  );
  res.redirect('/metas');
});


app.get('/metas/delete/:id', async (req, res) => {
  await Meta.destroy({ where: { id: req.params.id } });
  res.redirect('/metas');
});

app.get('/', async (req, res) => {
  let tasks = await Task.findAll();
  tasks = tasks.map((task) => task.dataValues);

  res.render('index', { tasks });
});


app.get('/create', (req, res) => {
  res.render('create');
});



app.post('/create', async (req, res) => {
  const { nome, descricao } = req.body;
  await Task.create({ nome, descricao });
  res.redirect('/');
});


app.get('/edit/:id', async (req, res) => {
  let task = await Task.findByPk(req.params.id);
  task = task.dataValues;

  res.render('edit', { task });
});


app.post('/edit/:id', async (req, res) => {
  const { nome, descricao, status } = req.body;
  await Task.update(
    { nome, descricao, status: status === 'on' },
    { where: { id: req.params.id } }
  );
  res.redirect('/');
});


app.get('/delete/:id', async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.redirect('/');
});


app.get('/categories', async (req, res) => {
  let categories = await Category.findAll();
  categories = categories.map((category) => category.dataValues);

  res.render('category/index', { categories });
});


app.get('/categories/create', (req, res) => {
  res.render('category/create');
});


app.post('/categories/create', async (req, res) => {
  const { nome, descricao } = req.body;
  await Category.create({ nome, descricao });
  res.redirect('/categories');
});


app.get('/categories/edit/:id', async (req, res) => {
  let category = await Category.findByPk(req.params.id);
  
  if (!category) {
    return res.status(404).send('Categoria não encontrada');
  }

  res.render('category/edit', { category: category.dataValues });
});



app.post('/categories/edit/:id', async (req, res) => {
  const { nome, descricao } = req.body;
  await Category.update(
    { nome, descricao },
    { where: { id: req.params.id } }
  );
  res.redirect('/categories');
});


app.get('/categories/delete/:id', async (req, res) => {
  await Category.destroy({ where: { id: req.params.id } });
  res.redirect('/categories');
});

app.get('/lista-compras', async (req, res) => {
  let lista = await ListaCompras.findAll();
  lista = lista.map((item) => item.dataValues);
  
  res.render('listaCompras/index', { lista });
});


app.get('/lista-compras/create', (req, res) => {
  res.render('listaCompras/create');
});


app.post('/lista-compras/create', async (req, res) => {
  const { nome, quantidade } = req.body;
  await ListaCompras.create({ nome, quantidade });
  res.redirect('/lista-compras');
});


app.get('/lista-compras/edit/:id', async (req, res) => {
  let item = await ListaCompras.findByPk(req.params.id);
  if (!item) return res.status(404).send('Item não encontrado');

  res.render('listaCompras/edit', { item: item.dataValues });
});


app.post('/lista-compras/edit/:id', async (req, res) => {
  const { nome, quantidade, comprado } = req.body;
  await ListaCompras.update(
    { nome, quantidade, comprado: comprado === 'on' },
    { where: { id: req.params.id } }
  );
  res.redirect('/lista-compras');
});


app.get('/lista-compras/delete/:id', async (req, res) => {
  await ListaCompras.destroy({ where: { id: req.params.id } });
  res.redirect('/lista-compras');
});

app.post('/favoritar/:id', async (req, res) => {
  let task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).send('Tarefa não encontrada');

 
  task.favorito = !task.favorito;
  await task.save();

  res.redirect('/');
});


app.post('/fixar/:id', async (req, res) => {
  let task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).send('Tarefa não encontrada');


  task.fixada = !task.fixada;
  await task.save();

  res.redirect('/');
});



const path = require('path');


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
