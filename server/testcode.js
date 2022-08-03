const xml2js = require('xml2js');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const flat = require('node-flat-db')
const storage = require('node-flat-db/file-sync')

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
let szXMLConv = '';

console.time('timer');
  class TestReader {
    methodID = -1;
    m_definitions = null;

    constructor(methodID) {
        this.methodID = methodID;
    }

    performTest = () => {

        switch (this.methodID)
        {
            case 1:
                this.readXML();
                break;
            case 2:
                this.readJSON();
                break;
            case 3:
                this.readParseJSON();
                break;   
        }
    }

    readXML = () => {
        fs.readFile('./newIncident.xml', 'utf8', (err, data) => {
            if (!err) {
                console.log(data);
        
                xml2js.parseString(data, { explicitRoot: true, explicitArray: false }, (err, body) => {
                    console.log(JSON.stringify(body));
                    console.log(body);            
                });
            }
            else {      
                console.error(err);
            }
        });
    }

    readJSON = () => {
        fs.readFile('./newIncident.json', 'utf8', (err, data) => {
            if (!err) {
                console.log(data);
        
                const jsonObj = JSON.parse(data);
                console.log(jsonObj.incident.position.lat);
        
                const builder = new xml2js.Builder({ explicitChildren: true });
        
                szXMLConv = builder.buildObject(jsonObj);
        
                console.log(szXMLConv);
        
                xml2js.parseString(szXMLConv, { explicitRoot: true, explicitArray: false }, (err, body) => {
                    console.log(JSON.stringify(body));
                    console.log(body);            
                });
            }
            else {      
                console.error(err);
            }
        });
    }   

    navigateObjTree = (jsonObj, rootObj) => {
        for (let key in jsonObj) {
            const newObj = jsonObj[key];

            let objType = typeof newObj;

            let bIsObj = false;

            if (objType === 'object') {

                bIsObj = true;
                if (Array.isArray(newObj)) {
                    objType = 'array';
                }

                const szCamelKey = key.charAt(0).toUpperCase() + key.slice(1);

                let newDef = {type: objType, properties:{}, title: szCamelKey};
                this.m_definitions[szCamelKey] = newDef;

                if (rootObj != null) {
                    rootObj[szCamelKey] =  {$ref: "#/definitions/" + szCamelKey};
                }

                if (bIsObj) {
                    this.navigateObjTree(jsonObj[key], newDef.properties) 
                }                
            }
            else {
                rootObj[key] = { type: objType, title: key};
            }
        } 
    }

    readParseJSON = () => {
        let rootObj = {
            $schema: "http://json-schema.org/draft-06/schema#",
            $ref: "#/definitions/Root",
            definitions: {}
        };

        this.m_definitions = rootObj["definitions"];

        fs.readFile('./data/testData.json', 'utf8', (err, data) => {
            if (!err) {
                const jsonObj = { Root: JSON.parse(data)};

                this.navigateObjTree(jsonObj, null);
            //    console.log(JSON.stringify(rootObj));
               console.log(rootObj);
            } else {      
                console.error(err);
            }
        });
    }   
  }


//   readline.question(`Specify Method [1,2,3]?`, methodID => {

//     const parsed = parseInt(methodID, 10);

//     const newTester = new TestReader(parsed);
//     newTester.performTest();

//     readline.close();
//   });

console.clear();

//   const newTester = new TestReader(3);
//   newTester.performTest();

var defaultBooks = [
    { title: "Adventures in Winking", detail: "Jack's Debut Release" },
    { title: "Winking over Stranger Things", detail: "Jack returns with a masterpiece" }
  ];

  const db = flat('db/db.json', { storage })

//   db.object = {};
//   db.write();

//    db.object.system = {};
//    db.write();

 if (db('books').size() === 0) {
    defaultBooks.forEach((element) => {

     let newElem = { id:uuidv4(), ...element};

    db('books').push(newElem);
    //console.log(element);
   });
}
   //db.write(); 


//    const user = db('system').find({ name: 'Ed' })

//   const bFound =  (user !== undefined);

//   console.log(bFound);
 


//   console.log(user);



//   console.log(dbInst);

//process.exit(1);

process.exitCode = 1;
//console.timeEnd('timer');
 