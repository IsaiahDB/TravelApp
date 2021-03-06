const dotenv = require("dotenv")
dotenv.config()

const path = require("path")
const express = require("express")
const fetch = require("node-fetch")
let projectData = {}

const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const cors = require("cors")
const { response } = require("express")
app.use(cors())

app.use(express.static('dist'))

app.get('/', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'))
})

app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})

app.get('/serverconnected', function (req, res) {                       
    res.json({
        name: 'isaiah',
        appName: 'travelappcapstone',
        grader: 'udacity',
        server: 'connected'
    });
})



app.get('/all', function sendData(request,response){
    response.send(projectData)
});


app.post('/vactionData', addData);
function addData(req, res) {
    let data = req.body;
    console.log('server side data ', data)
    projectData['lattitude'] = data.lattitude;
    projectData['longitutde'] = data.longitutde;
    projectData['city'] = data.city;
    projectData['imageloc'] = data.imageloc;
    projectData['country'] = data.country;
    projectData['description'] = data.description;
    projectData['icon'] = data.icon;
    projectData['descriptionTwo'] = data.descriptionTwo;
    projectData['iconTwo'] = data.iconTwo;

    res.send(projectData);
}


module.exports = app