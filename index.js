const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
app.use(express.static("public"));

const cors = require('cors');

app.use(cors());

// Read
app.get('/dogs', (req, res) => {
    fs.readFile('./data/kutyak.json', (err, file) => {
        res.send(JSON.parse(file));
    });   
});

// Read by id
app.get("/dogs/:egyediAzonosito", (req, res) => {
    const id = req.params.egyediAzonosito;
  
    fs.readFile("./data/kutyak.json", (err, file) => {
      const dogs = JSON.parse(file);
      const dogById = dogs.find((dog) => dog.id === id);
  
      if (!dogById) {
        res.status(404);
        res.send({ error: `id: ${id} not found` });
        return;
      }
  
      res.send(dogById);
    });
  });

 
  // Create
app.post("/dogs", bodyParser.json(), (req, res) => {
    console.log(req.body);
    const newDog = {
      id: uuidv4(),
      name: sanitizeString(req.body.name),      
      description: sanitizeString(req.body.description),         
      kepUrl: req.body.kepUrl,
    };
  
    fs.readFile("data/kutyak.json", (err, file) => {
      const dogs = JSON.parse(file);
      dogs.push(newDog);
      fs.writeFile("data/kutyak.json", JSON.stringify(dogs), (err) => {
        res.send(newDog);
      });
    });
  });


  app.listen(process.env.PORT);

function sanitizeString(str) {
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
    return str.trim();
  }
  
function uuidv4() {
return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
    v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
})};