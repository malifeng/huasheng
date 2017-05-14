/**
 * Created by malifeng on 2017/4/20.
 */
var Sequelize = require('sequelize');


let sequelize = require('./modelhead')();

var Users = sequelize.define('users', {
    id: {type:Sequelize.BIGINT,primaryKey: true},
    username: Sequelize.STRING,
    customer: Sequelize.STRING,
    userphoto: Sequelize.STRING,
    usernumber:Sequelize.STRING,
    useremail:Sequelize.STRING,
    userpwd:Sequelize.STRING,
    userrepwd:Sequelize.STRING,
    role:Sequelize.INTEGER,
    createtime:Sequelize.DATE,
    updatetime:Sequelize.DATE
},
    {
    timestamps: false,
    //paranoid: true  //获取不到id的返回值
    }
);

module.exports = Users;