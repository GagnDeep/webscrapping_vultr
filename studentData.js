const rp = require('request-promise');
const cheerio = require('cheerio')
const axios = require('axios');
let students = {}

const headers = {
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    
    "Cache-Control": "no-cache, no-store",
    
}

const header2 = {
    "Connection": "keep-alive",
    
    "Content-Type": "application/x-www-form-urlencoded",
    "Cache-Control": "no-cache, no-store",
    "Upgrade-Insecure-Requests": "5",
}

const body = {
    "__EVENTTARGET": "student",
    "__EVENTARGUMENT": "",
    "__VIEWSTATE": "",
    "__VIEWSTATEGENERATOR": "",
    "EVENTVALIDATION": "",
    "txt_userid": "",
    "txt_pwd": "",
    "txt_username_o": "",
    "txt_pwd_o": "",
    "StuUID": "714-17-622",
    "StuPwd": "10013",
    "btnStuLogin": "Login"
}

rp({
    method: "get",
    uri: "https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx",
    headers: header2
    })
    .then(res => {
        let $ = cheerio.load(res);
        let eventValidation = $("input#__EVENTVALIDATION").prop("value"),
            viewStateGenerator = $("input#__VIEWSTATEGENERATOR").prop("value"),
            viewState = $("input#__VIEWSTATE").prop("value");

        body["__EVENTVALIDATION"] = eventValidation;
        body["__VIEWSTATEGENERATOR"] = viewStateGenerator;
        body["__VIEWSTATE"] = viewState;

        // console.log(body)
        rp({
            method: "post",
            uri: "https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx",
            headers: headers,
            form: body
            
        })
            .then((...d) => {
                console.log(d);
                extractData(d);
            })
    }).catch(err=> console.log(err))

function extractData(data) {
    // console.log(data)
    
    let $ = cheerio.load(data);
    let rollno = $("#lblRollNo").text();
    
    students[rollno] =  {
            image: $("#Image1").prop("src"),
            name: $("#lblApp_Name").text(),
            registration: $("#lblRegNo").text() 
    }
    console.log(students)
}