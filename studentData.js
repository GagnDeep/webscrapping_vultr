const rp = require('request-promise');
const cheerio = require('cheerio')
const axios = require('axios');

const headers = {
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    
    "Cookie": "ASP.NET_SessionId=whhidgc2wiucq4wxfavoi3fr",
}

const header2 = {
    "Connection": "keep-alive",
    
    "Content-Type": "application/x-www-form-urlencoded",
    "Cache-Control": "max-age = 0",
    "Upgrade-Insecure-Requests": "5",
    "Cookie": "ASP.NET_SessionId=whhidgc2wiucq4wxfavoi3fr",
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
    "StuUID": "714-17-514",
    "StuPwd": "9901",
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

        console.log(body)
        rp({
            method: "post",
            uri: "https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx",
            headers: headers,
            form: body
            
        })
            .then(d => {
                // axios.get("https://exam.pupadmissions.ac.in/Examination_Form/paper.aspx", header2)
                // .then(e => console.log(e.data))

                console.log(d)
                // rp("https://exam.pupadmissions.ac.in/Examination_Form/paper.aspx").then(e=>console.log(e))
            })
    }).catch(err=> console.log(err))
