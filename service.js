var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const admin = require('firebase-admin')
const port = 5000
const serviceAccount = require("./config/password-generator-fa473-firebase-adminsdk-qyqpt-1c241b344a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://password-generator-fa473.firebaseapp.com"
});
const db = admin.firestore()
var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

async function getData(req,res,next)
{
  const text = req.body.text
  await db.collection('users').doc().set({text:text});
  const getdetails = await db.collection('users').get();
  const jsondata = {}
  var i = 0
  getdetails.forEach(doc => {
    jsondata[i] = doc.data()
    i++
  });
  if(getdetails){
   res.status(200).send(jsondata)
  }
  else
  {
    res.status(404).send('Incorrect Details!!')
  }
  
}

app.post('/getdata', getData)




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})