<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Todo_model extends CI_Model {
    public function __construct()
        {
                parent::__construct();
                // Your own constructor code
                $this->load->database();
        }
    public function get_todos(){
        $query = $this->db->query('SELECT id,title,completed  FROM todos');
        $results = $query->result();
        foreach($results as & $result){
            $result->completed = $result->completed == 1 ? true:false;
        }
        return $results;
    }
    public function insert_todo($todo){
        $query = $this->db->query('INSERT INTO `todos`( `title`, `completed`) VALUES (?,?)',$todo);
        $todo['id'] = $this->db->insert_id();
        return $todo;
    }
    public function update_todo($id,$todo){
        $query = $this->db->query('UPDATE `todos` SET `title`=?,`completed`=? WHERE `id`= ? ',array($todo['title'],$todo['completed'],$id));
        return $todo;
    }
    public function remove_todo($id){
        $query = $this->db->query('DELETE FROM `todos` WHERE id = ?',$id);
        return true;
    }
}