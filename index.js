const http = require("http")
const iconv = require("iconv-lite")
const fs = require("fs");


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


function gap(query) {

  return new Promise(function(rs){
    const options = {
      hostname: 'www.028hao.com',
      path: `/ydxuanhao/?${query}`,
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

async function action(pre, fileName) {
  let all = []
  for(let i=1; i<2000; i++) {
    const q = `page_no=${i}&dis=1&jiage=1st&st=4&ttk=${pre}________`
    const arr = await gap(q)
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

//setTimeout(()=>action("136", "p_136"), 1000)

//setTimeout(()=>action("138", "p_138"), 1000)

//setTimeout(()=>action("139", "p_139"), 1000)

//setTimeout(()=>action("135", "p_135"), 1000)

setTimeout(()=>action("158", "p_158"), 1000)

setTimeout(()=>action("159", "p_159"), 1000)

