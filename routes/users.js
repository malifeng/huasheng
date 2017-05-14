var router = require('koa-router')();
var multiparty = require('multiparty');
var fs = require('fs');
let  Users = require('../models/UserModel');
var sequelize = require('../models/modelhead')();

router.get('/', function (ctx, next) {
  ctx.body=1;
});
// 测试
router.get('/userceshi/:page', function (ctx, next) {
    console.log("aaaa");
    ctx.body=1;
    console.log("测试")
});

router.post('/photo',async function (ctx, next) {
    var form = new multiparty.Form();
    //设置编码
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "./public/images/";  //临时文件路径
    //设置单文件大小限制
    form.maxFilesSize = 2 * 1024 * 1024;
    form.maxFields = 1000;  //设置所以文件的大小总和
    let rs = await new Promise(function (resolve, reject) {
        form.parse(ctx.req, function (err, fields, files) {
            // console.log("--------------------------------");
            // for (let key in files) {
            //     console.log(key);
            // }
            // console.log("--------------------------------");
            let uploadurl = '/images/upload/';	//目标路径
            let file1 = files['file'];
            let paraname = file1[0].fieldName;  //参数名filedata
            let originalFilename = file1[0].originalFilename; //原始文件名
            let tmpPath = file1[0].path;//uploads\mrecQCv2cGlZbj-UMjNyw_Bz.txt
            let fileSize = file1[0].size;//文件大小
            //
            var timestamp = new Date().getTime(); //获取当前时间戳
            uploadurl += timestamp + originalFilename;
            let newPath = './public' + uploadurl;   //目标路径

            var fileReadStream = fs.createReadStream(tmpPath);
            var fileWriteStream = fs.createWriteStream(newPath);
            fileReadStream.pipe(fileWriteStream); //管道流
            fileWriteStream.on('close', function () {
                fs.unlinkSync(tmpPath);    //删除临时文件夹中的图片
                // ctx.body = "aaaa";
            resolve(uploadurl)

            });

            //-----------------------------------------
            // console.log(ctx.request)
        })
    });
    ctx.body=rs;
})
router.post('/createuser',async function (ctx, next) {
    // console.log("aaa");
    ctx.request.body['role']=1;
    ctx.request.body.createtime=new Date();
    ctx.request.body.updatetime=new Date();
    try{
        // console.log("bbbbb");
        console.log(ctx.request.body);
        let rs = await Users.create(ctx.request.body);
        console.log('rs:'+rs);
        // console.log("cccc")
        ctx.body = 1;
        console.log("插入成功");
    }catch(err){
        console.log(err);
        ctx.body=0;
        console.log('插入失败');
    }
});

router.get('/userlist/',async function (ctx, next) {
    console.log("aaa");
    let page = 1;
    console.log(ctx.request.query.page)
    if(ctx.request.query.page){
        let a=[];
        a= ctx.request.query.page.split("=");
        page=parseInt(a[0]);
        console.log(a)
    }
    // console.log(ctx.request.query.page)
    console.log(page);
    if(page<1){
        page=1;
    }
    let countRs = await sequelize.query('select count(*) as sum from users where role=1 ');
    // console.log(countRs[0][0].sum);
    let count = countRs[0][0].sum;
    // console.log("count="+count);
    let pageLimit = 6;
    let countPage = Math.ceil(count/pageLimit);
    if(countPage>0&&page>countPage){
        page=countPage;
    }

    let point = (page-1)*pageLimit;
    // console.log(countRs);
    // console.log("aaaa");
    let rs = await sequelize.query('SELECT * FROM users limit ?,?',{replacements:[point,pageLimit],type:sequelize.QueryTypes.SELECT});
    // let result = JSON.parse(JSON.stringify(rs));
    // console.log("bbbb");
    let results = rs[0];
    // console.log(rs);
    ctx.body={count:count,page:page,countPage:countPage,userrs:rs};
});


module.exports = router;
