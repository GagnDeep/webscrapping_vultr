var arr = require("./data.js");
arr = arr.filter(e => e.rollno);
arr.forEach(e=>console.log(e.rollno, e.mobile, e.name));
console.log(arr.length);