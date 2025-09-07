const express = require("express");
const cors  = require("cors");
const app = express();
const mysql = require("mysql2");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"localhost",
    user:'root',
    password:'ailab',
    database:"TODOLIST"
})
 
db.connect((err)=>{
    if(err)
    {
        console.log("error connecting to database");
        return;
    }
    console.log("connected with database");
})

app.get("/", (req, res) => {
    console.log("default route");
    db.query("select * from todoitems",(err,result)=>{
        if(err)
        {
            console.log("error occured",err);
            return
        }
        console.log("Data: ",result);
        res.send(result);

    })

});

app.post('/add-item',(req,res)=>{
    console.log(req.body);
    
    db.query(`insert into todoItems(itemDescription)values(?)`,[req.body.text],(err,results)=>{
        if(err)
        {
            console.log("error occured",err);
            return
        }
         // send back inserted row details
      res.json({
        ID: results.insertId,
        itemDescription: req.body.text,
        status: "pending", // default
      });
        console.log("created succesfully");
    })
    
});
app.put("/edit-item",(req,res)=>{
    console.log("line 54:",req.body);
     db.query(`update todoitems set itemDescription = ? where ID =?`,[req.body.itemDescription,req.body.ID],(err,results)=>{
        if(err)
        {
            console.log("error occured",err);
            return
        }
        console.log("created succesfully");
    })
    res.json({success:true})
})
// Delete todo
app.delete("/delete-item/:id", (req, res) => {
  const todoId = req.params.id;

  db.query("DELETE FROM todoItems WHERE ID = ?", [todoId], (err, result) => {
    if (err) {
      console.log("error occurred", err);
      return res.status(500).send("DB error");
    }

    res.json({ success: true, ID: todoId });
  });
});

app.listen(3400,()=>{
    console.log("server started running on port 3400");
});