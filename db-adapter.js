const sqlite3 = require('sqlite3').verbose();

class DbAdapter {
    constructor(db_file_path) {
        this.db_name = db_file_path;
        this.db = new sqlite3.Database(this.db_name);
    }
    initialize(){
        return new Promise((resolve, reject) => {
            this.db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, completed INTEGER);", err => {
                if(err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
    get_all_tasks(){
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * from tasks;", (err, rows)=>{
               if(err){
                   reject(err);
               }
               resolve(rows);
            });
        });
    }
    insert_task(task_text){
        return new Promise((resolve, reject) => {
            this.db.run("INSERT INTO tasks (text, completed) VALUES($text, $completed);", {$text:task_text, $completed:0}, function(err, rows){
                if(err){
                    reject(err);
                }
                resolve(this.lastID);
            });
        });
    }
    set_completed(task_id, is_completed){
        return new Promise((resolve, reject) => {
            this.db.run("UPDATE tasks SET completed = $completed WHERE id = $task_id;", {$task_id:task_id, $completed:is_completed}, (err, rows)=>{
                if(err){
                    reject(err);
                }
                resolve(this.lastID);
            });
        });
    }
    delete_task(task_id){
        return new Promise((resolve, reject) => {
            this.db.run("DELETE from tasks WHERE id = $task_id;", {$task_id:task_id}, (err, rows)=>{
                if(err){
                    reject(err);
                }
                resolve(this.lastID);
            });
        });
    }
    close(){
        this.db.close();
    }
}

module.exports = DbAdapter;