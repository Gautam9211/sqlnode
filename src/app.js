const express = require('express');
const app = express();
const port = process.env.PORT||2000;
const mysql = require('mysql');
app.use(express.json());


var pool  = mysql.createPool({
  connectionLimit : 10,
  host: "localhost",
  user: "root",
  password: "YoYo9211",              /////---------- your root password here ---------------/////////
  database: "useradmin",
  multipleStatements: true
});  


/////---------------    TABLES CREATED IF THE TABLES DOESN'T EXISTS IN THE DATABASE   --------------/////////

pool.getConnection((err,connection)=>{
    if(err) throw err;
        console.log(`connected id :: ${connection.threadId}`)
        const query= 'CREATE TABLE IF NOT EXISTS tb_user( `user_id` INT NOT NULL AUTO_INCREMENT , `admin_id` INT NOT NULL , `user_name` VARCHAR(256) NOT NULL , `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`user_id`)) ENGINE = InnoDB;CREATE TABLE IF NOT EXISTS tb_admin( `admin_id` INT NOT NULL AUTO_INCREMENT , `is_active` TINYINT NOT NULL DEFAULT "1" , `admin_name` VARCHAR(256) NOT NULL ,`users` INT, `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`admin_id`)) ENGINE = InnoDB';
      
     connection.query(query,(err,tables)=>{
        connection.release();
     if(!err){
            console.log("tables are created if doesn't exists");      
        }
        else{
            console.log(err)
        }
    })

})

//---------------DATA INSERTED INTO  tb_user and tb_admin TABLE --------------------------/////////////////

pool.getConnection((err,connection)=>{
    if(err) throw err;
        console.log(`connected id :: ${connection.threadId}`)
        const insertQuery= 'INSERT INTO tb_user(admin_id,user_name) VALUES ?';
         let values = [ 
            ['1', 'Dheeraj sir'],
           ['2', 'Gautam Agarwal'],  
           ['3', 'sunny Kumar'],
            ['4', 'Nishi'],
            ['5', 'shivam'],
            ['6', 'Rashid'],  
            ['7', 'thapa techical'],
             ['8', 'preeminence'],
             ['9', 'Nitish'],
             ['10', 'Honey singh'],  
             ['11', 'Manoj'],
              ['12', 'Harshit']
          ]; 
         connection.query(insertQuery,[values],(err,rows)=>{
        
        if(!err){
            console.log("Number of data inserted in tb_user: " + rows.affectedRows);  
        }
        else{
            console.log(err)
        }
    })
    const insertQuery1= 'INSERT INTO tb_admin (admin_name,users) VALUES ?';
    let values1 = [  
     ['Bharat Kumar','23'],  
     [ 'sunny Kumar','2'],
       [ 'Begfh Kumar','25'],
       ['sunny Kumar','21'],
       [ 'Nishi','233'],
       [ 'shivam','100'],
       [ 'Rashid','4'],  
       [ 'thapa techical','3'],
        [ 'preeminence','2'],
        [ 'Nitish','12'],
        [ 'Honey singh','21'],  
        [ 'Manoj','43'],
         ['Harshit','1']
   ]; 


    connection.query(insertQuery1,[values1],(err,rows)=>{
    connection.release();
   if(!err){
       console.log("Number of data inserted in tb_admin: " +rows.affectedRows );  
   }
   else{
       console.log(err)
   }
})

})

 ///   for all data without pagination   //////////
 // ------- url will be    "     /users     "      ---------------//

app.get("/users",(req,res)=>{

    pool.getConnection((err,connection)=>{
        if(err) throw err;
        console.log(`connected id :: ${connection.threadId}`)
        console.log(res.send)

        connection.query('SELECT * FROM tb_user',(err,rows)=>{
            connection.release();
            if(!err){
                res.send(rows);
            }
            else{
                console.log(err)
            }
        })

    })
})


 
                // ------------------- - with pagination  {question first of assignment} -----------------------------------------
                  // ------- url will be    "  /users/paginations?page=1 "     or    "    /users/paginations?page=2  "   ---------------//

app.get("/users/pagination",(req,res)=>{
    const limit = 7
    // page number
    const page = req.query.page
    // calculate offset
    const offset = (page - 1) * limit
    // query for fetching data with page number and offset
    const prodsQuery = "select * from tb_user limit "+limit+" OFFSET "+offset
    pool.getConnection(function(err, connection) {
      connection.query(prodsQuery, function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();
             if (error) throw error;
        // create payload
        var jsonResult = {
          'products_page_count':results.length,
          'page_number':page,
          'products':results
        }
        // create response
        // var myJsonString = JSON.parse(JSON.stringify(jsonResult));
        res.statusMessage = "Products for page "+page;
        res.statusCode = 200;
        res.send(jsonResult);
        res.end();
      })
    })
})

//------- with odd userid          {second question of assignment}-------   ////
// ------- url will be      " /users/paginations/?page=1&id=odd " or   " /users/paginations/?page=2&id=odd "  ---------------//
app.get("/users/paginations",(req,res)=>{
    const limit = 7
    // page number
    const page = req.query.page;
    const id = req.query.id;
    // calculate offset

    if(id=="odd"){     
    const offset = (page - 1) * limit
    // query for fetching data with page number and offset
    const prodsQuery = "select * from tb_user  where `user_id` IN (1,5,7) limit "+limit+" OFFSET "+offset;
    pool.getConnection(function(err, connection) {
      connection.query(prodsQuery, function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();
             if (error) throw error;
        // create payload
        var jsonResult = {
          'products_page_count':results.length,
          'page_number':page,
          'products':results
        }
        // create response
        // var myJsonString = JSON.parse(JSON.stringify(jsonResult));
        res.statusMessage = "Products for page "+page;
        res.statusCode = 200;
        res.send(jsonResult);
        res.end();
      })
    })
   }
})

      /// ---------------------- with admin has at least 3 users------------------------//////
      ///------ url will be "   /users/admin/paginations?page=1   " or "   /users/admin/paginations?page=2   "   -------////     

app.get("/admin/paginations",(req,res)=>{
    const limit = 5
    // page number
    const page = req.query.page;
    // calculate offset
    const offset = (page - 1) * limit
    // query for fetching data with page number and offset
    const prodsQuery = "select * from tb_admin  where users >= 3 limit "+limit+" OFFSET "+offset;
    pool.getConnection(function(err, connection) {
      connection.query(prodsQuery, function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();
             if (error) throw error;
        // create payload
             var jsonResult = {
             'products_page_count':results.length,
             'page_number':page,
             'products':results
           }
        res.statusMessage = "Products for page "+page;
        res.statusCode = 200;
        res.send(jsonResult);
        res.end();
      })
    })
   
})


app.listen(port,()=>{
    console.log(`system is setup on port : ${port}`);
})



