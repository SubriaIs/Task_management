import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './Filtertask.css';
import './Button.css';
import Creatable from 'react-select/creatable';

function Filtertask() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [activeTask, setActiveTask] = useState(false);
  const [profiles, setProfiles] = useState({colorCode: "#ffffff"});

  //const vars
  const[taskArrays, setTaskArrays] = useState([]);
  const[taskTimeIntervals, setTaskTimeIntervals] = useState([]);

  useEffect(() => {
    // Get the current date and time using Moment.js
    const currentMoment = moment();

    // Format the updated time as 'YYYY-MM-DDTHH:mm:ss'
    const formattedTime = currentMoment.format('YYYY-MM-DDTHH:mm:ss');

    // Set both start and end times
    setStartTime(formattedTime);
    setEndTime(formattedTime);

    getAllTasks();
    getAllTimeIntervals()
    getAllProfiles();
  }, []);

  // fetch data
  function getAllTasks(){
    fetch ('http://localhost:3010/tasks/')
    .then(res => res.json())
    .then((data) => setTaskArrays(data))
    .catch((error) => console.error('Error fetching tasks:', error));
  }
// fetching data for time
  function getAllTimeIntervals(){
    fetch ('http://localhost:3010/timeintervals/')
    .then(res => res.json())
    .then((data) => setTaskTimeIntervals(data))
    .catch((error) => console.error('Error fetching intervals:', error));
  }

// fetch data for setting option
function getAllProfiles(){
  fetch ('http://localhost:3010/profiles/')
  .then(res => res.json())
  .then((data) => {
    setProfiles(data);
  })
  .catch((error) => console.error('Error fetching profiles:', error));
}


  function TaskElement(props){
    const [taskname] = useState(props.name)

    return (
      <div className="Homefilter">
        <ul className="borderfilter">
          <li>
            <div>
              <b>{taskname}</b>
            </div>
          </li>
          <li>
          <ul>
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

  function TaskElements() {
    // Filter tasks that are active within the specified time range

    let uniqueTasksTags = []
    let tagTasks = []; // filtered tasks and tags
    // eslint-disable-next-line
    taskTimeIntervals.map((tagTime) => {
    let taskStartTime = moment(tagTime.startTimeDate, 'YYYY-MM-DDTHH:mm:ss');
    let taskEndTime = moment(tagTime.endTimeDate, 'YYYY-MM-DDTHH:mm:ss');
    let filterStartTime = moment(startTime, 'YYYY-MM-DDTHH:mm:ss');
    let filterEndTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss');
      if(taskEndTime.isSameOrBefore(filterEndTime) && taskStartTime.isSameOrAfter(filterStartTime)){

        tagTasks.push({ "taskId": tagTime.taskId, "tagId": tagTime.tagId})

      }

    });

    for (let i= 0; i < tagTasks.length; i++){
      let isDuplicate = false;
      for ( let j = i+1; j < tagTasks.length ; j++){
      if(tagTasks[i].taskId === tagTasks[j].taskId && tagTasks[i].tagId === tagTasks[j].tagId){
        isDuplicate = true;
      }
      }
      if(!isDuplicate){
        uniqueTasksTags.push(tagTasks[i])
      }
    }


    // taskgroup
    let allTasks = [];


    for (let i= 0; i < uniqueTasksTags.length; i++){
      let ntask = { "name": taskArrays[uniqueTasksTags[i].taskId].name, "tags": [] }
      ntask.tags.push(taskArrays[uniqueTasksTags[i].taskId].tags[uniqueTasksTags[i].tagId])
      allTasks.push(ntask)
    }


    return (
      <div className="flex-container">
        <div className="row">

          {allTasks.map((task, id) => (
            <div key={id} className="flex-item">
              <TaskElement
                key={task.id}
                id={task.id}
                name={task.name}
                tags={task.tags}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }


  const Totaltime=() =>{
    const [tagOptsEdit, setTagOptsEdit] = useState([]);
    const [taskOptsEdit, setTaskOptsEdit] = useState([]);
    const [tagsEdit, setTagsEdit] = useState([]);
    const [taskEdit, setTaskEdit] = useState([]);
    const [taskTotalTime, setTaskTotalTime] = useState(0);
    const [tagTotalTime, setTagTotalTime] = useState(0);
    //for task
    const setTaskOptions = () => {
      let sTO = [];
      for (let i = 0; i < taskArrays.length; i++) {
        let tTask = taskArrays[i];
        let ag = {
          "value": tTask.id,
          "label": tTask.name
        };

        sTO.push(ag);
      }

     setTaskOptsEdit(sTO);
    };
    //for tags
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
//Total tags time
    const onChange = (Tags) => {
      if (Tags === null){
        return
      }
      setTagsEdit(Tags);
      let totaltime = 0;
      let minutes =0 ;
      setTagTotalTime(0);

      let tasktime = Tags.value;
      let array = [];
      for (let i = 0; i < taskArrays.length; i++) {
        for (let j = 0; j < taskArrays[i].tags.length; j++) {
          if(taskArrays[i].tags[j].name === tasktime){
            array.push ({
              "taskId":taskArrays[i].id,
              "tagId" :taskArrays[i].tags[j].id,
              "tagName":taskArrays[i].tags[j].name
            })
          }
        }
      }

      // eslint-disable-next-line
      taskTimeIntervals.map((tagTime) => {
      let tagStartTime = moment(tagTime.startTimeDate, 'YYYY-MM-DDTHH:mm:ss');
      let endTime = tagTime.endTimeDate;
      if(endTime === ""){
        endTime = moment().format('YYYY-MM-DDTHH:mm:ss')
      }
      let tagEndTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss');
      let filterStartTime = moment(startTime, 'YYYY-MM-DDTHH:mm:ss');
      let filterEndTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss');
        if(tagEndTime.isSameOrBefore(filterEndTime) && tagStartTime.isSameOrAfter(filterStartTime) ){
          for(let i=0; i<array.length; i++){
            if( (array[i].taskId === tagTime.taskId) && (array[i].tagId === tagTime.tagId)){
          minutes = moment
          .duration(moment(endTime, 'YYYY/MM/DD HH:mm')
          .diff(moment(startTime, 'YYYY/MM/DD HH:mm'))
          ).asMinutes();
          totaltime= totaltime+ minutes;

        }
      }
      }
      });

      setTagTotalTime(totaltime)

    };

//Total task time
    const onChangeTaskEdit = (Task) => {
      if (Task === null){
        return
      }
      let total = 0;
      let minutes =0 ;
      setTaskTotalTime(0);
      setTaskEdit(Task);
      // eslint-disable-next-line
      taskTimeIntervals.map((tagTime) => {
      let taskStartTime = moment(tagTime.startTimeDate, 'YYYY-MM-DDTHH:mm:ss');
      let endTime = tagTime.endTimeDate;
      if(endTime === ""){
        endTime = moment().format('YYYY-MM-DDTHH:mm:ss')
      }
      let taskEndTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss');
      let filterStartTime = moment(startTime, 'YYYY-MM-DDTHH:mm:ss');
      let filterEndTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss');
        if(taskEndTime.isSameOrBefore(filterEndTime) && taskStartTime.isSameOrAfter(filterStartTime) && tagTime.taskId === Task.value){
          minutes = moment
          .duration(moment(endTime, 'YYYY/MM/DD HH:mm')
          .diff(moment(startTime, 'YYYY/MM/DD HH:mm'))
          ).asMinutes();
          total= total+ minutes;

        }

      });

      setTaskTotalTime(total)
    };

    return(
      <div>
        <label>Choose Task name to get total time:
      <Creatable
        value={taskEdit}
        onChange={onChangeTaskEdit}
        onFocus={setTaskOptions}
        options={taskOptsEdit}
        isClearable
        placeholder="Select task.."
      />
      </label>
      <br></br>
      <label>Task Total time : {taskTotalTime} minutes.</label>
      <br></br>
      <br></br>
      <label>Choose Tag name to get total time:
      <Creatable
        value={tagsEdit}
        onChange={onChange}
        onFocus={setTagOptions}
        options={tagOptsEdit} // You can provide predefined options if needed
        isClearable
        placeholder="Select tag.."
      />
      </label>
      <br></br>
      <label>Tag Total time : {tagTotalTime} minutes.</label>
      <br></br>
      <br></br>
      {activeTask === true  && (<button className="btn btn-danger btn-round-1" onClick={() => setActiveTask(false)}>Close</button>)}
      </div>
    )
  }


  return (
    <div className='filtertext'style={{textAlign: 'center', backgroundColor: profiles.colorCode}}>
      <h1>Filtertask</h1>

      {activeTask === false && <p>Filtering tasks and tags using time</p>}
      <p>Choose time:</p>
      <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      -
      <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      <br></br>
      {activeTask === false && <TaskElements/>}
      <br></br>
      {activeTask === false  && <button className="btn btn-success btn-round-1" onClick={() => setActiveTask(true)} >Total active time</button>}

      {activeTask === true && <Totaltime/>}

    </div>
  );
}

export default Filtertask;
