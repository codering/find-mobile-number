const http = require("http")
const iconv = require("iconv-lite")
const fs = require("fs");

const P_TYPE = {
  "CHINA_TELECOM": "cdma",
  "CHINA_MOBILE": "ydxuanhao"
}

function writeData(data, fileName, append) {
  fs.writeFileSync(fileName, data.join("\n"));
  // if (!append) {
  //   fs.writeFileSync(fileName, "");
  // } else {
  //   fs.appendFileSync(fileName, data.join("\n"))
  // }
}
function filter(item, data) {
  return item.filter(i => data.indexOf(i) === -1)
}

function parseNumer(content) {
  let arr = []
  content.replace(/&hm=(\d+)"\sclass="h-b"/g, function(a,b) {
    arr.push(b)
  })
  return arr;
}


function gap(url) {

  return new Promise(function(rs){
    const options = {
      hostname: 'www.028hao.com',
      path: url,
      method: 'GET',
    }
    const req = http.request(options, function(res) {
      //res.setEncoding('gbk')
      var chunks = [];
      //get 请求
      res.on('data', function(data) {
        chunks.push(data);
      });
      //获取到数据 source，我们可以对数据进行操作了!
      res.on('end', function() {
        const html = iconv.decode(Buffer.concat(chunks), 'gb2312')
        let arr = parseNumer(html)
        //arr.sort()
        rs(arr)
      });
    }).on('error', function() {
      console.log("Error！");
    });
    req.end();
  })
}

async function sleep(s) {
  return new Promise(function(rs){
    setTimeout(function() {
      rs();
    }, s * 1000)
  })
}

async function action(path, pre, fileName) {
  let all = []
  for(let i=1; i<5000; i++) {
    const url = `/${path}/?page_no=${i}&dis=1&jiage=1st&st=4&ttk=${pre}________`
    const arr = await gap(url)
    if (arr.length === 0) {
      break;
    }
    all = all.concat(filter(arr,all))
    console.log( `${pre}_page: ${i}`)
    if (i % 10 == 0) {
      //writeData(all, true)
    }
    await sleep(1.5)
  }
  all.sort();
  writeData(all, fileName)
  console.log(`${pre}_total: ${all.length}`)
  
}

//====== 移动 ======

/**
 setTimeout(()=>action(P_TYPE.CHINA_MOBILE, "136", "p_136"), 1000)

 setTimeout(()=>action(P_TYPE.CHINA_MOBILE, "138", "p_138"), 1000)

 setTimeout(()=>action(P_TYPE.CHINA_MOBILE, "139", "p_139"), 1000)

 setTimeout(()=>action(P_TYPE.CHINA_MOBILE, "135", "p_135"), 1000)

 setTimeout(()=>action(P_TYPE.CHINA_MOBILE, "158", "p_158"), 1000)

 setTimeout(()=>action(P_TYPE.CHINA_MOBILE, "159", "p_159"), 1000)
 */

 //====== 电信的 =======

 setTimeout(()=>action(P_TYPE.CHINA_TELECOM, "180", "p_180"), 1000)
