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
  var contract = a[3];
  var bill = "";

  axios.post("https://energycorp.herokuapp.com/api/invoice/by-contract/", { contractNumber: parseInt(contract) })
  //   .then(response => {
  //     console.log(response.data);
  //     res.json(
  //       {
  //         "fulfillmentText": response.data.invoices[0].codeInvoice,
  //         "fulfillmentMessages": [
  //           {
  //             "text": {
  //               "text": [response.data.invoices[0].codeInvoice]
  //             }
  //           }
  //         ],
  //         "source": "<webhookpn1>"
  //       });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })
  .then(response => {
    var { error, find } = response.data;
    if (error === true || find === false) {
      res.json(
        {
          "fulfillmentText": "Ups. error :(",
          "fulfillmentMessages": [
            {
              "text": {
                "text": ["Ups. error :("]
              }
            }
          ],
          "source": "<webhookpn1>"
        });
    } else {
      var codeInvoice = response.data.invoices[0].codeInvoice;
      // console.log(codeInvoice);
      bill = codeInvoice;
      answ = "Consultalo en el siguiente link:" + "<a href='https://energycorp.herokuapp.com/api/invoice/pdf/'" + contract + "/" + bill + "/>Link</a>";
      res.json(
        {
          "fulfillmentText": answ,
          "fulfillmentMessages": [
            {
              "text": {
                "text": [answ]
              }
            }
          ],
          "source": "<webhookpn1>"
        });
    }
  })
  .catch(err => {
    res.json(
      {
        "fulfillmentText": "err.response",
        "fulfillmentMessages": [
          {
            "text": {
              "text": ["err.response"]
            }
          }
        ],
        "source": "<webhookpn1>"
      });
  })

})
//start server
app.listen(app.get('port'), () => {
  console.log('😬 Backend Running on port:', app.get('port'));
})
