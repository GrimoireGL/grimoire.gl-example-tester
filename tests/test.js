const fs = require("fs");

const hashes = JSON.parse(fs.readFileSync(".e2e-target","utf-8"));

const result = {

};
for(let i = 0; i < hashes.length; i++){
  const hash = hashes[i];
  const key = `${i}  :  ${hashes[i]}`;
  result[key] = (client)=>{
    client
      .url('https://localhost:9443/gex/#' + hash)
      .pause(2000)
      .getLog('browser',(l)=>{
        l.forEach(log=>{
          if(log.level === "SEVERE" || log.level === "ERROR"){
            const message = log.message;
            if(message.indexOf("favicon.ico") >= 0 || message.indexOf("index.goml") >= 0){
              return;
            }
            if(log.level === "SEVERE" || log.level === "ERROR"){
              client.verify.fail(log.message);
            }
          }else if(log.level === "WARN"){
            console.warn(log.message);
          }
        });
      })
      .saveScreenshot(`./ss/${hash}.png`)
      .end();
  };
}
module.exports = result;
