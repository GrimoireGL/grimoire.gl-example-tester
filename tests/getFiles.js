const assert = require("chai").assert;
const fs = require("fs");
const path = require("path");
const ignore = ["static",".git","node_modules"];
const targetFolder = "../../www/examples";

function readDir(dir){
  return new Promise((resolve,reject)=>{
    fs.readdir(dir,(err,files)=>{
      if(err){
        reject(err);
      }else{
        resolve(files);
      }
    });
  });
}

function isFile(file){
  return new Promise((resolve,reject)=>{
    fs.stat(file,(err,stats)=>{
      if(err){
        reject(err);
      }else{
        resolve(!stats.isDirectory());
      }
    });
  });
}

function filterFiles(dir){
  return readDir(dir).then(files=>{
    const tasks = files.map(f=>isFile(path.join(dir,f)));
    return Promise.all(tasks).then(isFiles=>{
      return files.filter((f,i)=>{
        return !isFiles[i];
      });
    });
  });
}

const filesPromise = filterFiles(targetFolder).then(fl=>{
  return fl.filter(f=>ignore.indexOf(f) === -1);
});

filesPromise.then(t=>{
  fs.writeFile(".e2e-target",JSON.stringify(t,null,2),()=>{})
})
