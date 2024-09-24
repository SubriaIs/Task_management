import React, {useState,useEffect} from 'react';
import './App.js';
import './Home.css';
import './Button.css';
import moment from 'moment';
import Creatable from 'react-select/creatable';
import { Draggable } from "react-drag-reorder";

function Home() {

  const [profiles, setProfiles] = useState({colorCode: "#ffffff"});
  const [activeTask, setActiveTask] = useState(false);
  const [activeTaskEdit, setActiveTaskEdit] = useState(false);
  const [activeTime, setActiveTime] = useState(false);
  const [activeTaskFilter, setActiveTaskFilter] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const [modifyTaskId, setModifyTaskId] = useState(null);
  const [modifyTaskEdit, setModifyTaskEdit] = useState([]);
  const [tagsEdit, setTagsEdit] = useState([]);
  const [taskEdit, setTaskEdit] = useState([]);
  const[timeintervals, setTimeintervals] = useState([]);

  //global variable
  const[taskArrays, setTaskArrays] = useState([]);


  useEffect (() => {

    getAllProfiles();
    getAllTasks();
    getAllTimeIntervals();

  }, []);


// fetch data for setting option
function getAllProfiles(){
  fetch ('http://localhost:3010/profiles/')
  .then(res => res.json())
  .then((data) => {
    setProfiles(data);
  })
  .catch((error) => console.error('Error fetching profiles:', error));
}

// update tag alternative mode
function updateTaskTag(task,tagId){

  task.tags[tagId].status = "Deactive";
  let bodyPayload = JSON.stringify(task);
  fetch('http://localhost:3010/tasks/'+task.id, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: bodyPayload,
        })
          .then((res) => {
            if(res.statusText === "OK" && res.status === 200){
              console.info("updated: task "+task.id)
            }
            else {
              console.error("error in update.")
            }
            })
          .catch((err) => alert("Something Wrong 2!"))
}

  // update time
  function updateTimeInterval(task,tI){
    let bodyPayload = JSON.stringify(tI);
    fetch('http://localhost:3010/timeintervals/'+tI.id, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: bodyPayload,
          })
            .then((res) => {
              if(res.statusText === "OK" && res.status === 200){
                console.info("updated: time interval "+tI.taskId);
              }
              else {
                console.error("error in update.")
              }
              })
            .catch((err) => alert("Something Wrong 1!"))
  }

  // fetching data
  function getAllTasks(){
    fetch ('http://localhost:3010/tasks/')
    .then(res => res.json())
    .then((data) => {
      setTaskArrays(data);
    })
    .catch((error) => console.error('Error fetching tasks:', error));
  }

  function getAllTags(){
    let sTO = [];

    for (let i = 0; i < taskArrays.length; i++) {
      let tTask= taskArrays[i];
      for (let j = 0; j < tTask.tags.length; j++) {
        let ag = {
          "value": tTask.tags[j].name,
          "label": tTask.tags[j].name,
        }
        sTO.push(ag);
      }
   }
   return sTO;
  }
// fetching data for time
  function getAllTimeIntervals(){
    fetch ('http://localhost:3010/timeintervals/')
    .then(res => res.json())
    .then((data) => setTimeintervals(data))
    .catch((error) => console.error('Error fetching intervals:', error));
  }

  function TaskElement(props){
    const [taskname] = useState(props.name)


    //Edit option
    const handleEditClick = (id) => {
      setActiveTaskEdit(true);
      setTaskId(id);
      let itask = taskArrays[id];
      let tn = {
        "value": itask.name,
        "label": itask.name,
      }
      setTaskEdit(tn);
      let sTOS = []
      for (let j = 0; j < itask.tags.length; j++) {
        let ag = {
          "value": itask.tags[j].name,
          "label": itask.tags[j].name,
          "status":itask.tags[j].status
        }
        sTOS.push(ag);
      }
      setTagsEdit(sTOS)
    };

  //Active and Deactive
    const handelTime = (id) =>{
      let itask = taskArrays[id];
      // Implement Alternative Mode
      if(profiles.mode === "Alternative Mode"){
        if(window.confirm('Alternative mode is now enabled. Are you sure you want to inactive other tasks except '+itask.name)){
          setActiveTime(true);
          setModifyTaskId(id);
          let tn = {
            "value": itask.name,
            "label": itask.name,
          }
          setModifyTaskEdit(tn)

          for( let i =0; i< timeintervals.length; i++){
            if((timeintervals[i].taskId !== itask.id) && (timeintervals[i].endTimeDate === "")){
              let obj= timeintervals[i];
              obj.endTimeDate = moment().format('YYYY-MM-DDTHH:mm:ss');
              updateTimeInterval(itask, obj);
              updateTaskTag(taskArrays[timeintervals[i].taskId],timeintervals[i].tagId);
            }
          }
        }
        else{
          return
          //nothing
        }
      }
      else{
        setActiveTime(true);
          setModifyTaskId(id);
          let tn = {
            "value": itask.name,
            "label": itask.name,
          }
          setModifyTaskEdit(tn)
      }
    }

    //Delect option
    const handleDeleteClick = (id,name) => {
      if (window.confirm('Are you sure you want to delete from database Task: '+name+' ?')) {
        fetch('http://localhost:3010/tasks/'+id, { method: 'DELETE' })
        .then((res) => {
          if(res.statusText === "OK" && res.status === 200){
            alert("Deleted Successfully!")
            const newTaskList = taskArrays.filter((item) => item.id !== id);
            setTaskArrays(newTaskList);
        } else { alert("Something Wrong!") }});
      } else {
        //nothing I am free
      }
    };

    return (
      <div className="Home">
        <ul className="border">
          <li>
            <div className="task">
              <b>{taskname}</b>
              <br></br>
              <button className="btn btn-primary btn-round-1 btn-margin" onClick={() => handleEditClick(props.id)}>Edit</button>
              <button className="btn btn-danger btn-round-1 btn-margin" onClick={() => handleDeleteClick(props.id, props.name)}>Remove Task</button>
              {props.status === "Deactive" &&<button className="btn btn-success btn-round-1" onClick={() => handelTime(props.id)}>Active</button>}
              {props.status === "Active" &&<button className="btn btn-danger btn-round-1" onClick={() => handelTime(props.id)}>Deactive</button>}
            </div>
          </li>
          <li>
          <ul className="tag">
            {props.tags.map((tag, index) => (
              <React.Fragment key={tag.id}>
                {index > 0 && <br />}
                {tag.name}
              </React.Fragment>
            ))}
          </ul>
          </li>
        </ul>
      </div>
    );

  }


  function TaskElements(){
    const taskElements = [];
    for(let i = 0 ;i < taskArrays.length; i++){
      let tas = taskArrays[i];
      tas.status = "Deactive";
      for(let j = 0 ; j< taskArrays[i].tags.length; j++ ){
        if(taskArrays[i].tags[j].status === "Active")
        {
          tas.status = "Active";
        }
      }

      taskElements.push(
        <TaskElement
          key={tas.id}
          id={tas.id}
          name={tas.name}
          tags={tas.tags}
          status={tas.status}
        />
      )
    }

    return (
      <div >
        <div>
          <Draggable>
            {taskElements.map((te, id) => {
              return (
                <div key={id}>
                  {te}
                </div>
              );
            })}
          </Draggable>
        </div>
      </div>
    );

  }



// edit task and tags
const EditTask=() =>{
  const [tagOptsEdit, setTagOptsEdit] = useState([]);
  if(taskId === null){
    alert("Something Wrong!")
    return
  }
  const setTagOptions = () => {
    let sTO = [];
    for (let i = 0; i < taskArrays.length; i++) {
      let tTask= taskArrays[i];
      for (let j = 0; j < tTask.tags.length; j++) {
        let ag = {
          "value": tTask.tags[j].name,
          "label": tTask.tags[j].name,
          "status":"Deactive"
        }
        sTO.push(ag);
      }
   }
   setTagOptsEdit(sTO);
  };

  const onChangeTags = (Tags) => {
    setTagsEdit(Tags);
  };
  const onChangeTaskEdit = (Task) => {
    setTaskEdit(Task);

  };
  const onSaveTask = () => {
    if(taskEdit === null){
      alert("Missing Fields: Task Name!")
      return
    }
    if(taskEdit.length === 0 || tagsEdit.length === 0 ){
      alert("Missing Fields: Check both fields!")
      return
    }
    let nTags = [];
    for (let i = 0; i < tagsEdit.length; i++) {
       if(tagsEdit[i].status === undefined){
        tagsEdit[i].status = "Deactive";
       }
        let stag = {
          "id": i,
          "status":tagsEdit[i].status,
          "name": tagsEdit[i].value,
        }
        nTags.push(stag);
    }
    let ntask = {
      id : taskId,
      name  : taskEdit.value,
      tags : nTags,
    };

    let bodyPayload= JSON.stringify(ntask);

    fetch('http://localhost:3010/tasks/'+taskId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyPayload,
    })
      .then((res) => {
        if(res.statusText === "OK" && res.status === 200){
          alert("Modified Successfully!")
          getAllTasks();
          setTaskEdit([]);
          setTagsEdit([]);
          setTaskId(null);
          setActiveTaskEdit(false);
        }
        else {

          alert("Something Wrong!")
        }
        })
      .catch((err) => alert("Something Wrong!"))
  };

  return (
    <div className='edit'>
      <label>Edit Task Name:
      <Creatable
        value={taskEdit}
        onChange={onChangeTaskEdit}
        options={[]}
        isClearable
        placeholder="Type to create task.."
      />
      </label>
      <br></br>
      <label>Edit Tags name:
      <Creatable
        isMulti
        value={tagsEdit}
        onChange={onChangeTags}
        onFocus={setTagOptions}
        options={tagOptsEdit}
        isClearable
        placeholder="Type to create or select tags.."
      />
      </label>
    <button className="btn btn-success btn-round-1" onClick={onSaveTask}>Save</button>
    </div>
  )
}

//Active and Deactive tags option
const handleActiveDeactiveTags = (taskId, tagId, textStatus) => {
  if (window.confirm('Are you sure you want to ' + textStatus + ' this tag?')) {

    let method2 = 'POST'
    let payl = null;

    if(textStatus === "Deactive"){

      for( let i = 0; i< timeintervals.length ; i++){
        let tint = timeintervals[i]
        if(tint.taskId === taskId && tint.tagId === tagId && tint.endTimeDate === ""){
          payl = tint;
        }
      }
    }

    let nTask = taskArrays[taskId];
    nTask.tags[tagId].status = textStatus;
    let payBody = JSON.stringify(nTask);

    // First, update the tag's status
    fetch('http://localhost:3010/tasks/'+taskId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payBody,
    })
      .then((res) => {
        if (res.status === 200) {
          alert(`${textStatus} Successfully!`);

          let ntag = {
            taskId: taskId,
            tagId: tagId,
            startTimeDate: '',
            endTimeDate: '',
          };
          let url= 'http://localhost:3010/timeintervals/';
          if(payl != null){
            method2 = 'PATCH';
            url = 'http://localhost:3010/timeintervals/'+payl.id;
            ntag.startTimeDate = payl.startTimeDate;
            ntag.endTimeDate = payl.endTimeDate;
          }

          if (textStatus === 'Deactive') {
            ntag.endTimeDate = moment().format('YYYY-MM-DDTHH:mm:ss');
          } else {
            ntag.startTimeDate = moment().format('YYYY-MM-DDTHH:mm:ss');
          }

          // Next, add the time interval
          fetch(url, {
            method: method2,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ntag),
          })
            .then((res) => {
              if(textStatus === "Active"){
                if (res.status === 201) {
                  alert('Time Interval Added Successfully!');
                  // Sync tags or time intervals as needed
                  getAllTags();
                  getAllTimeIntervals();
                } else {

                  alert('Something Went Wrong!');
                }
              }
              else {
                if (res.status === 200) {
                  alert('Time Interval Modified Successfully!');
                  // Sync tags or time intervals as needed
                  getAllTags();
                  getAllTimeIntervals();
                } else {

                  alert('Something Went Wrong!');
                }
              }
            })
            .catch((err) => {

              alert('Something Went Wrong!');
            });
        } else {

          alert('Something Went Wrong!');
        }
      })
      .catch((err) => {

        alert('Something Went Wrong!');
      });
  } else {
    // User canceled the operation
  }
};


//Active and Deactive
const Time=() =>{
  return(
    <div>
      <label>Task Name:
      <Creatable
        value={modifyTaskEdit}
        placeholder="Type to create or select task.."
      />
      </label>
      <br></br>
      <table className="center">
        <thead>
          <tr>
            <th>Tags:</th>
          </tr>
        </thead>
        <tbody>
          {taskArrays[modifyTaskId].tags.map((tag, index) => (
            <tr key={index}>
              <td>
                <ul>
                    <li key={index+1}>{tag.name}
                    <br></br>
                    {tag.status === "Deactive" &&<button className="btn btn-success btn-round-1" onClick={() => handleActiveDeactiveTags(modifyTaskId,tag.id, "Active")}>Active</button>}
                    {tag.status === "Active" &&<button className="btn btn-danger btn-round-1" onClick={() => handleActiveDeactiveTags(modifyTaskId,tag.id, "Deactive")}>Deactive</button>}

                    </li>
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

//Create new task and tags
  const Newtask=() =>{
    const [tags, setTags] = useState([]);
    const [task, setTask] = useState([]);
    const [tagOpts, setTagOpts] = useState([]);

    const setTagOptions = () => {
      let sTO = [];
      for (let i = 0; i < taskArrays.length; i++) {
        let tTask= taskArrays[i];
        for (let j = 0; j < tTask.tags.length; j++) {
          let ag = {
            "value": tTask.tags[j].name,
            "label": tTask.tags[j].name,
          }
          sTO.push(ag);
        }
     }
     setTagOpts(sTO);
    };
    const onChange = (newTags) => {
      setTags(newTags);
    };
    const onChangeTask = (newTask) => {
      setTask(newTask);
    };
    const onSaveTask = () => {
      if(task === null){
        alert("Missing Fields: Task Name!")
        return
      }
      if(task.length === 0 || tags.length === 0 ){
        alert("Missing Fields: Check both fields!")
        return
      }
      let nTags = [];
      for (let i = 0; i < tags.length; i++) {
          let stag = {
            "id": i,
            "status": "Deactive",
            "name": tags[i].value,
          }
          nTags.push(stag);
      }
      //Creating new task
      let ntask = {
        id : taskArrays.length,
        name  : task.value,
        tags : nTags,
      };

      let bodyPayload= JSON.stringify(ntask);

      fetch('http://localhost:3010/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyPayload,
      })
        .then((res) => {
          if(res.statusText === "Created" && res.status === 201){
             alert("Saved Successfully!")
             getAllTasks();
             setTask([]);
             setTags([]);
            } else {

              alert("Something Wrong!")
             }})
        .catch((err) => alert("Something Wrong!"))
    };
    return (
      <div>
      <form>
        <label>Enter Task Name:
        <Creatable
          value={task}
          onChange={onChangeTask}
          options={[]} // You can provide predefined options if needed
          isClearable
          placeholder="Type to create task..."
        />
        </label>
        <br></br>
        <label>Enter Tags name:
        <Creatable
          isMulti
          value={tags}
          onChange={onChange}
          onFocus={setTagOptions}
          options={tagOpts}
          isClearable
          placeholder="Type to create or select tags..."
        />
        </label>
      </form>
      <button className="btn btn-success btn-round-1" onClick={onSaveTask}>Save</button>
      </div>
    )
  }



  // Filter tasks and tags
  const onFilter = (newTags) => {
    setActiveTaskFilter(newTags);
    let activeTasks=[];
    for(let i=0; i<taskArrays.length; i++){
      let tTask= taskArrays[i];
      for(let j=0; j<tTask.tags.length; j++){
        let tTags=tTask.tags[j].name;
          for(let k=0; k<newTags.length; k++){
            if(newTags[k].value===tTags){
              if(!activeTasks.includes(tTask)){
                activeTasks.push(tTask)
              }
            }
          }
      }
    }
    if(activeTasks.length>0){
      setTaskArrays(activeTasks)
    }
    else{
      getAllTasks();
    }
  };


    return (
      <div style={{textAlign: 'center', backgroundColor: profiles.colorCode}} >
        <h1 className='heading'>Home</h1>
        {activeTask === false && activeTaskEdit === false && activeTime === false &&
        <label>Filter task using tags:
        <Creatable
        isMulti
        value={activeTaskFilter}
        onChange={onFilter}
        options={getAllTags()}
        isClearable
        placeholder="Select tags.."
        />
      </label>
      }
      <br></br>
        {activeTask === false && activeTaskEdit === false && activeTime === false && <button className="btn btn-success btn-round-1" onClick={() => setActiveTask(true)} >Add New Task</button>}
        <br></br>
        <br></br>
        {activeTask === true && activeTaskEdit === false && activeTime === false && (<button className="btn btn-danger btn-round-1" onClick={() => setActiveTask(false)}>Close Add Mode</button>)}
        {activeTask === false && activeTaskEdit === true && activeTime === false && (<button className="btn btn-danger btn-round-1" onClick={() => {setActiveTaskEdit(false); setTaskId(null)}}>Close Edit Mode</button>)}
        {activeTask === false && activeTaskEdit === false && activeTime === true && <button className="btn btn-danger btn-round-1" onClick={() => setActiveTime(false)} >Close</button>}
        {activeTask === true && activeTaskEdit === false && activeTime === false && <Newtask/>}
        {activeTask === false && activeTaskEdit === true && activeTime === false && <EditTask/>}
        {activeTask === false && activeTaskEdit === false && activeTime === false && <TaskElements/>}
        {activeTask === false && activeTaskEdit === false && activeTime === true && <Time/>}
      </div>
    );
  }

  export default Home;