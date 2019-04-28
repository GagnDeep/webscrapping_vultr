const cheerio = require('cheerio')
const axios = require('axios');

const headers = {
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
}

const header2 = {
    "Connection": "keep-alive",
    "Cache-Control": "max-age = 0",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Mobile Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    "Referer": "https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Cookie": "ASP.NET_SessionId=xjbvos4s1jredlbqfu20deav",
}

const body = {
    "__EVENTTARGET": "",
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

axios.get("https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx")
    .then(res => {
        let $ = cheerio.load(res.data);
        let eventValidation = $("input#__EVENTVALIDATION").prop("value"),
            viewStateGenerator = $("input#__VIEWSTATEGENERATOR").prop("value"),
            viewState = $("input#__VIEWSTATE").prop("value");

        body["__EVENTVALIDATION"] = eventValidation;
        body["__VIEWSTATEGENERATOR"] = viewStateGenerator;
        body["__VIEWSTATE"] = viewState;

        console.log(body)
        axios.post("https://exam.pupadmissions.ac.in/Examination_Form/LoginCollege.aspx", body, headers)
            .then(d => {
                axios.get("https://exam.pupadmissions.ac.in/Examination_Form/paper.aspx", header2)
                .then(e => console.log(e.data))

                // console.log(Object.keys(d), d.config)
            })
    })
