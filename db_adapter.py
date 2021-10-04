import sqlite3

class DbAdapter:
    def __init__(self, db_name):
        self.db_name = db_name
        self.conn = None

    def initialize(self):
        self.conn = sqlite3.connect(self.db_name, check_same_thread=False)
        # self.conn.row_factory = sqlite3.Row

        cursor = self.conn.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, completed INTEGER);")
        self.conn.commit()

    def get_all_tasks(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * from tasks;")
        return [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]

    def insert_task(self, task_text):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO tasks (text, completed) VALUES(:text, :completed);", {'text':task_text, 'completed':0})
        self.conn.commit()
        return cursor.lastrowid

    def set_completed(self, task_id, is_completed):
        cursor = self.conn.cursor()
        cursor.execute("UPDATE tasks SET completed = :completed WHERE id = :task_id;", {'task_id': task_id, 'completed':is_completed})
        return cursor.lastrowid

    def delete_task(self, task_id):
        cursor = self.conn.cursor()
        cursor.execute("DELETE from tasks WHERE id = :task_id;", {'task_id': task_id})
        self.conn.commit()

    def close(self):
        self.conn.close()
