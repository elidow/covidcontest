/*
 *  upload.js
 *  Does: uploads post data to MySQL database after posting
 */

var http = require('http');
var url = require('url');

/*
 * creating server:
 * This server first interprets the entires in the form
 * Then, it creates a unique post id for the post
 * Finally, it inserts the correct data into the table
 */
http.createServer(function (req, res) {

    //keeps from server running twice
    if (req.url != '/favicon.ico') {
        console.log(req.url);
        res.writeHead(200, {'Content-Type': 'text/html'});

        //setting entries of forms to local variables
        var qobj = url.parse(req.url, true).query;
        var title = qobj.title;
        var name = qobj.name;
        var category = qobj.category;
        var description = qobj.description;
        var format = qobj.format_type;
        var media = qobj.media;
        var id = -1;

        //creating connection to MySQL
        var mysql = require('mysql');

        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "Crosscountry5",
            database: "posts"
        });

        var get_id = "SELECT post_id FROM posts WHERE post_id="
        + "(SELECT max(post_id) FROM posts)";
        
        //connection to MySQL database
        con.connect(function(err) {
            if (err) throw err;

            //querying get_id to retrieve unique id (max id in table + 1)
            con.query(get_id, function (err, result, fields) {
                if (err) throw err;
                
                if(result.length > 0) {
                    id = parseInt(result[0].post_id) + 1;
                }
                else {
                    id = 1;
                }

                //concatenating line for insertion
                var insert = 'INSERT INTO posts VALUES(' + id + ',"' 
                    + title + '","' + name + '","'
                    + category + '","' + description + '","'
                    + format + '","' + media + '",0,0);';

                var sql = insert;

                con.query(sql, function (err2, result) {
                    if (err2) throw err2;
                    console.log("1 record inserted");
                });
            });
        });
        res.end();
    }
}).listen(8080);