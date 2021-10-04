from flask import Flask, jsonify, request
from db_adapter import DbAdapter

app = Flask(__name__, static_folder='public', static_url_path='')
app.config['JSON_AS_ASCII'] = False

dbAdapter = DbAdapter('todo.db')
dbAdapter.initialize()

@app.route("/")
def get_index():
    return app.send_static_file('index.html')

@app.route("/api/tasks", methods=['GET'])
def get_tasks():
    all_tasks = dbAdapter.get_all_tasks()
    return jsonify(all_tasks)

@app.route("/api/tasks", methods=['POST'])
def insert_task():
    data = request.get_json()
    new_id = dbAdapter.insert_task(data['task_text'])
    return jsonify({'id': new_id})

@app.route("/api/tasks/<task_id>", methods=['PUT'])
def set_completed(task_id):
    data = request.get_json()
    dbAdapter.set_completed(task_id, data['completed'])
    return jsonify({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/api/tasks/<task_id>", methods=['DELETE'])
def delete_task(task_id):
    dbAdapter.delete_task(task_id)
    return jsonify({'success':True}), 200, {'ContentType':'application/json'}


if __name__ == '__main__':
    app.run(debug=True, port=3000)