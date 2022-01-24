var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

app.user(express.static('public'));
app.user(bodyParser.json());

app.post('/update', function(req,res)
{
	pg.connect(process.env.DATABASE_URL, function(err, conn, done)
	{
		if(err) console.log(err);
		conn.query('UPDATE salesforce.Contact SET Phone = $1 , MobilePhone = $1 WHERE LOWER(FirstName) = Lower($2) AND LOWER(Lastname) = Lower($3) AND LOWER(Email)= LOWER($4)',
				[req.body.phone.trim(), req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim()],
				function(err,result)
				{
			if(err !=null || result.rowCount == 0)
				{
				conn.query('INSERT INTO salesforce.Contact (Phone, MobilePhone, FirstName, LastName, Email) VALUES ($1,$2,$3,$4,$5)' 
						,[req.body.phone.trim(),req.body.phone.trim(), req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim()], 
						function(err, result)
						{
							done();
							if(err)
								{
								res.status(400).json({error: err message});
								}
							else
								{
								res.json(result);
								}
						});
				}
			else
				{
				done();
				res.json(result);
				}
				}
	});
	
	});