const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded( {extended: true} ));
app.use(express.json());
/*
const cors = require('cors');
app.use(cors());
app.options('*', cors());
*/
const DbAdapter = require('./db-adapter.js');
const dbAdapter = new DbAdapter('todo.db');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.get('/api/tasks', async (req, res)=>{
  let all_tasks = await dbAdapter.get_all_tasks();
  res.json(all_tasks);
});

app.post('/api/tasks', async (req, res)=>{
  let new_id = await dbAdapter.insert_task(req.body.task_text);
  res.json({id:new_id});
});

app.put('/api/tasks/:task_id', async (req, res)=>{
  await dbAdapter.set_completed(req.params.task_id, req.body.completed);
  res.sendStatus(200);
});

app.delete('/api/tasks/:task_id',async (req, res)=>{
  await dbAdapter.delete_task(req.params.task_id);
  res.sendStatus(200);
});

async function setup(){
  await dbAdapter.initialize();
  console.log('Setup done.');
}

setup().then(()=>{
  app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`)
  });
})

process.on('exit', function () {
  console.log('Exiting.');
  dbAdapter.close();
});






