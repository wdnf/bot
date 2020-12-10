let sqlite = require("sqlite3").verbose();
const Database = require('better-sqlite3');

let queryGetAmount = "SELECT * FROM ledger WHERE userid = ?"
let queryInsertNewUser = "INSERT INTO ledger VALUES(?,?)"
let queryUpdateAmount = "UPDATE ledger SET amount = ? WHERE userid = ?"

module.exports = {
    startingAmount: 0,
    getBalance: (userid) =>{
        
        return new Promise(function(resolve, reject) {
            const db = new Database('./wdnf.db');
            let row = db.prepare(queryGetAmount).get(userid);
            if(row == undefined){
                let insert = db.prepare(queryInsertNewUser).run(userid,'0');
                db.close()
                resolve("0");
            }
            else{
                console.log(row.userid);
                let amount = row.amount;
                db.close();
                resolve(amount);
            };
        });

    },
    getAllMoney: ()=>{
        return new Promise(function(resolve, reject) {
            let totalMoney = 0;
            const db = new Database('./wdnf.db');
            let rows = db.prepare("SELECT * FROM ledger").all();
            rows.forEach(row => {
                totalMoney += row.amount;
            });
            resolve(totalMoney);
        }); 
    },
    getAllUser: ()=>{
        return new Promise(function(resolve, reject) {
            const db = new Database('./wdnf.db');
            let rows = db.prepare("SELECT * FROM ledger").all();
            resolve(rows);
        }); 
    },
    setBalance: async (userid,amount) =>{
        return new Promise(function(resolve, reject) {
            const db = new Database('./wdnf.db');
            let row = db.prepare(queryGetAmount).get(userid);
            if(row == undefined){
                let insert = db.prepare(queryInsertNewUser).run([userid,amount])
                db.close()
                resolve(true)
            }
            else{
                db.prepare(queryUpdateAmount).run([amount,userid])
                db.close();
                resolve(true)
            }
        });       
    }
}
