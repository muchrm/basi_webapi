<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Todos extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		echo "it's work!";
	}
	public function get_todos(){
		$this->load->model('todo_model');
		//echo json_encode([['id'=>1,'title'=>'learn angular','completed'=>true]]);
		echo json_encode($this->todo_model->get_todos());
	}
	public function add_todo(){
		$this->load->model('todo_model');
		$input_data = json_decode(trim(file_get_contents('php://input')), true);
		//echo json_encode($input_data);
		echo json_encode($this->todo_model->insert_todo($input_data));
	}
	public function update_todo($id){
		$this->load->model('todo_model');
		$input_data = json_decode(trim(file_get_contents('php://input')), true);
		//echo json_encode($input_data);
		echo json_encode($this->todo_model->update_todo($id,$input_data));
	}
	public function delete_todo($id){
		$this->load->model('todo_model');
		$this->todo_model->remove_todo($id);
		echo json_encode(['result'=>true]);
	}
}
