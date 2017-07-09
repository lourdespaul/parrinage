const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const path = require('path');
const moment = require('moment');

const app = express();

const Student = require('./models/student');
const Report = require('./models/report')

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/parinnage');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layout' });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, './node_modules/materialize-css/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

hbs.registerHelper('formatTime', function (date, format) {
    var mmnt = moment(date);
    return mmnt.format(format);
});

app.get('/',(req, res)=>{
    res.redirect('/1')
});

app.get('/:page',(req, res)=>{
    const perPage = 20;
    let page = req.params.page - 1;
    Student.find({})
        .limit(perPage)
        .skip(perPage * page)
        .exec(function(err, students) {
            Student.count().exec(function(err, count) {
                let pages = [];
                for (let i =1; i<=parseInt(count / perPage)+1; i++){
                    pages.push({page:i.toString(),active: (i == page+1)?true:false})
                }
                let prePage = (page == 0)? false: page-1;
                let postPage = (page == parseInt(count/perPage))? false: page+1
                res.render('home',{
                    students: students,
                    prePage: prePage,
                    pages: pages,
                    postPage: postPage
                });
        });
    });
});

app.post('/register', (req, res)=>{
    const data = req.body;
    let student = new Student({
        name: data.name.trim(),
        dob: data.dob.trim(),
        hostel: data.hostel.trim(),
        address: data.address.trim(),
        father: data.father.trim(),
        mother: data.mother.trim(),
        institution: data.institution.trim(),
        ins_address: data.ins_address.trim(),
        qualification: data.qualification.trim(),
        sponsor: data.sponsor.trim(),
        image: data.image.trim(),
        orphan: data.orphan.trim(),
        gender: data.gender.trim(),
        occupation: data.occupation.trim(),
    });
    student.save((err,result)=>{
        if(err) res.send(err);
        if(result) res.send(result);
    });
});

app.get('/student/:id', (req, res)=>{
    Student.findById(req.params.id,(err, result)=>{
        res.render('student', {profile:result});
    });
});


app.listen(8080, ()=>{
    console.log('The server is up')
});