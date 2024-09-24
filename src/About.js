import React, {useState,useEffect} from 'react';
import './About.css';

function About() {
  const [profiles, setProfiles] = useState({colorCode: "#ffffff"});

  useEffect (() => {
    getAllProfiles();
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

    return (
      <div  className='divpattern' style={{textAlign: 'center', backgroundColor: profiles.colorCode}}>
        <h1>About</h1>
        <p> <b> The name of the author: </b>Subria Islam</p>
        <p ><b>Instructions: </b>
        <br></br>
         <b>Home View:</b>
         <br></br>
          -In this view user can see all task and tags.
          <br></br>
          -By selecting tags user can filter tasks.
          <br></br>
          -"Add New Task" button gives the facility to create new tasks and tags.
          <br></br>
          -By clicking "Edit" button user can modify task name and add new tags.
          <br></br>
          -By clicking "Remove Task" button user can easily remove task.
          <br></br>
          -By clicking "Active" button user active task and also can active tags individually.
          <br></br>
          <b>About View:</b>
          <br></br>
          -Gives the instractions about this app and all related information.
          <br></br>
          <b>Filtertask:</b>
          <br></br>
          -By choosing start and end time user can see all tasks and tags that have been active at some point during the observation intervals.
          <br></br>
          -By clicking "Total active time" button user can see total times in minutes for individual task or tag during the observation interval.
          <br></br>
          <b>Settings:</b>
          <br></br>
          -By using "Choose color:" option user can easily choose his own favourite UI color.
          <br></br>
          -In "Choose mode:", there are Default Mode and Alternative Mode.
          By "Alternative Mode", user can able to active one task at a time.
          And by "Default Mode" user can able to active Multiple tasks at a time.
        </p>
        <p><b >Pictures and libraries:</b>
          <br></br>
          There is no Pictures in this application
          <br></br>
          -react-select/creatable (MIT Licensed)
          <br></br>
          -react-drag-reorder (MIT Licensed)
          <br></br>
          -moment (MIT Licensed)
        </p>
        <p></p>
      </div>
    );
  }

  export default About;