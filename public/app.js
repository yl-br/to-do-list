const appComponent = {
	data(){
		return {
			message: 'Current time: ' + (new Date()).toString(),
			tasks:[]
		};
	},
	async created(){
		// this.tasks = [{id:1, text:'1 task'}, {id:2, text:'2 task'}, {id:3, text:'3 task'}];
		let response = await axios.get('/api/tasks');
		this.tasks = response.data;

	},
	methods:{
		async add_task(task_text){
			let response = await axios.post('/api/tasks',{task_text:task_text});
			let new_id = response.data.id;
			this.tasks.push({id:new_id, text:task_text, completed:false});
		},
		async delete_task(task_id){
			let response = await axios.delete(`/api/tasks/${task_id}`);
			this.tasks.splice(this.tasks.map(t=>t.id).indexOf(task_id), 1);
		},
		async toggle_status(task_id){
			let task = this.tasks.find(item => item.id === task_id);
			if(task){
				let response = await axios.put(`/api/tasks/${task_id}`, {completed:! task.completed})
				task.completed = ! task.completed;
			}
		}
	}

};

const taskList = {
	emits:['delete-task', 'toggle-task-status'],
	props:['tasks'],
	template: `
	<ul>
		<li v-for="task in tasks">
			<span v-on:click="$emit('toggle-task-status', task.id)">
			<del v-if="task.completed">{{task.text}}</del>
			<i v-else>{{task.text}}</i>
			</span> 
			
			<a href="javascript:;" v-on:click="$emit('delete-task', task.id)" style="margin-left: 10px"><small>Delete</small></a>
		</li>
	</ul>
	`
}

const taskCreator = {
	emits:['add-task'],
	data(){
		return {new_task_text:null};
	},
	methods:{
		add_task(new_task_text){
			if(new_task_text==''){
				return;
			}
			this.$emit('add-task', new_task_text);
			this.new_task_text = null;
		}
	},
	template: `
		<input type="text" placeholder="New task" autofocus="autofocus" v-model="new_task_text">
		<button v-on:click="add_task(new_task_text)">Add</button>
	`
}



const app = Vue.createApp(appComponent);
app.component('task-list', taskList);
app.component('task-creator', taskCreator);
app.mount('#vue-app');