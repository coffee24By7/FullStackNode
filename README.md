# FullStackNode
Node Class Starting 06/19/2020

# Classwork For 08-01-2020 Notes
The  branch for 08-01-2020 is checked in to the Node class repository here: https://github.com/coffee24By7/FullStackNode/tree/Class_08-01-2020

The notes, videos, starter code and completed homework from 07-18-2020 can be found here.

The homework starter code for this week will be the foundation of future class work.  This is found in the MazeServ folder.   To run the server and test it you will need to ensure you have Mongo DB installed.   This can be accomplished on Windows by downloading and installing from here: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/\

Once it is installed you will need to run the following command in the MazeServ root folder: startmongo.cmd
You may need to edit the file variables.env if you have trouble connecting to Mongo.  The below data (highlighted yellow) from the variables.env file is what you would change.  Contact me if you have trouble installing/using MongoDB

NODE_ENV=development\
DATABASE=mongodb://localhost:27017/mazeGame\
MAIL_USER=b97dd6a19b267f\
MAIL_PASS=9f8105cdab96b4\
MAIL_HOST=smtp.mailtrap.io\
MAIL_PORT=2525\
PORT=7777\
SECRET=coffee\
KEY=caffiene24by7

Before you can run the following ensure you have nodemon installed.  Using this command: npm i nodemon -g\

When Mongo is successfully started you can call the command nodemon start.js to begin running the website.  Once it is running you should see something like the following:\

A:\Development\Node_Class_June_2020_Instructor\MazeServ>nodemon start.js

[nodemon] 2.0.4\
[nodemon] to restart at any time, enter `rs`\
[nodemon] watching path(s): *.*\
[nodemon] watching extensions: js,mjs,json\
[nodemon] starting `node start.js`\
Through login logic so checking routes\
(node:15984) DeprecationWarning: `open()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead, or set the `useMongoClient` option if using `connect()` or `createConnection()`. See http://mongoosejs.com/docs/4.x/docs/connections.html#use-mongo-client\
Express running → PORT 7777

You can now use the browser to access the site here: http://127.0.0.1:7777/

In order to do the homework you have the following task to accomplish.  Remember there is more than one way to do this and there is more than one right way to do this.  If we don’t use similar naming and logic though the homework will be harder to accomplish in the future.  So keep that in mind.

Edit the index.js file under the following folder /routes

Update the userController.js file in the /controllers folder.  You can add needed code based on the comments I made.   They are in the following code block.
// no login just show main page
exports.main = async (req, res) => {

Create a view under /views folder using PUG.

Create a mixin undedr /views/mixins folder using PUG

Create a worker class under the /public/scripts folder.

Create a model class under /models folder



