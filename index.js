//imports
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

//config
app.set('port', process.env.PORT || 8000);

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.json());///Hace lo mismo del bodyParser
app.use(morgan('dev'));
app.use(cors());

//routes
app.post("/", (req, res) => {
  var speech = req.body.queryResult &&
    req.body.queryResult.queryText
    ? req.body.queryResult.queryText
    : "Hubo un problema, intentalo nuevamente " + req.body;

  speech = "Sisas pri "+speech; 

  res.json(
    {
      "fulfillmentText": speech,
      "fulfillmentMessages": [
        {
          "text": {
            "text": [speech]
          }
        }
      ],
      "source": "<webhookpn1>"
    });

})
//start server
app.listen(app.get('port'), () => {
  console.log('😬 Backend Running on port:', app.get('port'));
})
