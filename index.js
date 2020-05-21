//imports
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const axios = require('axios');

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

  // axios.post 
  var a = speech.split(" ");
  var contract = a[4];
  var bill = "";
  var good = false;
  axios.post("https://energycorp.herokuapp.com/api/invoice/by-contract/", { contractNumber: contract })
    .then(res => {
      var { error, find } = res.data;
      if (error === true || find === false) {
        res.json(
          {
            "fulfillmentText": "Ups. No la encontre :(",
            "fulfillmentMessages": [
              {
                "text": {
                  "text": ["Ups. No la encontre :(1"]
                }
              }
            ],
            "source": "<webhookpn1>"
          });
      } else {
        var { codeInvoice } = res.data[0].invoices;
        bill = codeInvoice;
        good = true;
      }
    })
    .catch(err => {
      console.log(err);
    })

  if (good) {
    speech = "Consultalo en el siguiente link:" + "<a href='https://energycorp.herokuapp.com/api/invoice/pdf/'" + contract + "/" + bill + "/>Link</a>";
  } else {
    speech = "Ups. No la encontre :(2";
  }

  res.json(
    {
      "fulfillmentText": bill,
      "fulfillmentMessages": [
        {
          "text": {
            "text": [bill]
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
