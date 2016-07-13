var ejs = require("ejs");
var mysql = require('./mysql');
var session = require('client-sessions');
var crypto = require('crypto');

function signUp(req,res){
    var password = req.param("password");
    var algorithm = 'sha';
    var password = 'twitter123';

    var passwordCipher = crypto.createCipher(algorithm,password);
    var passwordCrypted = passwordCipher.update(password,'utf8','hex');
    passwordCrypted += passwordCipher.final('hex');
    console.log("Encrypted Password : "+passwordCrypted);

    var decipher = crypto.createDecipher(algorithm,password);
    var passwordDecrypted = decipher.update(password,'hex','utf8');
    passwordDecrypted += decipher.final('utf8');
    console.log("Decrypted Password: "+passwordDecrypted);

    var insertUser = "insert into users (username,email,password) values('"+req.param("fullName")+"','"+req.param("email")+"','"+req.param("password")+"');";
    console.log(insertUser);
    mysql.fetchData(function(err,results){
       if(err){
           throw err;
       } else{
           console.log("Added to DB");
           res.render("index");
       }
    },insertUser);
}
function afterSignIn(req,res)
{
// check user already exists
    var json_data;
    var getUser="select * from users where email='"+req.param("email")+"' and password='" +req.param("password") +"';";
    console.log("Query is:"+getUser);
    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                console.log("Login check: "+results[0].username);
                req.session.email = req.param("email");
                req.session.username = results[0].username;
                req.session.ID = results[0].ID;
                console.log("valid Login");
                json_data = {"statusCode" : 200};
                res.send(json_data);
            }
            else {
                json_data = {"statusCode" : 401};
                console.log("Invalid Login");
                res.send(json_data);
            }
        }

    },getUser);
}

function getTweets(req,res){
    var getTweets = 'select * from tweets';
    console.log('Query is: '+getTweets);
    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else{
            if(results.length > 0){
                var tweetJson = [];
                for(var i=(results.length-1);i>=0;i--){
                    tweetJson[(results.length-1)-i] = results[i];
                }
                res.send(tweetJson);
            }
        }
    },getTweets);
}

function tweet(req,res){
    var query = "insert into tweets values('"+req.session.email+"','"+ req.param("tweet")+"');";
    mysql.fetchData(function (err,results) {
        if(err){
            throw err;
        }
        else
        {
            console.log(tweet+" added");
            res.send(true);

        }
    },query);
}

function logout(req,res){
    console.log("Session variable: "+req.session.email);
    req.session.destroy();
    res.render("index");

}

function goToLogin(req,res){
    if(req.session.email){
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("Home");
    }
    else{
        res.render("index");
    }
}

function getCurrentUser(req,res){
    var currentUserEmail = req.session.email;

    var getCurrentUserQuery = "select username from users where email = '"+currentUserEmail+"';";

    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }else{
            res.send(results);
        }
    },getCurrentUserQuery);
}

function search(req,res){
    var searchString = req.param('searchStr');

    var searchQuery = "select * from users where username like '%"+searchString+"%';";
    console.log("Search Query: "+searchQuery);
    mysql.fetchData(function (err,results) {
        if(err){
            throw err;
        }else{
            res.send(results);
        }
    },searchQuery);
}

function getProfile(req,res){
    var resultsUserName;
    var resultTweet= [];
    var resultsEmail;
    var getProfileById = "select * from users where ID = "+req.param('id')+";";
    console.log("Get Profile Query: "+getProfileById);
    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }else{
            console.log("Results are: "+results[0].username);
            resultsUserName = results[0].username;
            resultsEmail = results[0].email;
            req.session.searchEmail = resultsEmail;
            res.render('profile',{searchResultsUserName: resultsUserName});
        }
    },getProfileById);
}

function searchTweet(req,res){
    var searchTweet = "select * from tweets where tweet like '%"+req.param('searchStr')+"%';";
    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }else{
            res.send(results);
        }
    },searchTweet);
}

function searchTweetByUser(req,res){
    var searchTweetByUserQuery = "select tweet from tweets where username = '"+req.param('username')+"';";
    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }else{
            res.send(results);
        }
    },searchTweetByUserQuery);
}

function follows(req,res){
    var follow = req.param('follow');
    var currentUser = req.session.username;
    var addFollowQuery = "insert into followers values('"+currentUser+"','"+follow+"');";
    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }else{
            console.log("Follower Added!");
            res.send('true');
        }
    },addFollowQuery);
}

exports.follows = follows;


exports.goToLogin = goToLogin;
exports.afterSignIn=afterSignIn;
exports.signUp = signUp;
exports.tweet = tweet;
exports.getTweet = getTweets;
exports.logout = logout;
exports.getCurrentUser = getCurrentUser;
exports.search = search;
exports.getProfile = getProfile;
exports.searchTweet = searchTweet;
exports.searchTweetByUser = searchTweetByUser;