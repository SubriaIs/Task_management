import React, {useState,useEffect} from 'react';
import Creatable from 'react-select/creatable';
import './Button.css';
import './Setting.css';

function Settings () {
    const [profiles, setProfiles] = useState({colorCode: "#ffffff"});
    const [mode, setMode] = useState(null);
    const [color, setColor] = useState("#ffffff");

    let arrayModes = []

    arrayModes.push({
        "value": "Default Mode",
        "label": "Default Mode",
    });

    arrayModes.push( {
        "value": "Alternative Mode",
        "label": "Alternative Mode",
    });


    useEffect (() => {
        getAllProfiles();
      }, []);

    function getAllProfiles(){
    fetch ('http://localhost:3010/profiles/')
    .then(res => res.json())
    .then((data) => {
        setProfiles(data);
        setColor(data.colorCode)
        setMode(data.mode)
    })
    .catch((error) => console.error('Error fetching profiles:', error));
    }

    const onChangeColor = (event) => {
        setColor(event.target.value);
    };

    const onChangeMode = (selectedOption) => {
        setMode(selectedOption.value);
    };
    const onSaveChanges = () => {

        let bodyPayload = JSON.stringify({
            "colorCode": color,
            "mode": mode,
        })
        fetch('http://localhost:3010/profiles/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: bodyPayload,
          })
            .then((res) => {
              if(res.statusText === "Created" && res.status === 201){
                alert("Modified Successfully!")
                getAllProfiles();
              }
              else {
                alert("Something Wrong!")
              }
              })
            .catch((err) => alert("Something Wrong!"))

    }

    return(
        <div style={{textAlign: 'center', backgroundColor: profiles.colorCode}}>
            <h1 className='headingsetting'><b>Settings</b></h1>
            <label>Choose color:
                <br></br>
                <input type="color" value={color} onChange={onChangeColor} />
            </label>
            <br></br>
            <br></br>
            <label>Choose mode:
                <br></br>
                    <Creatable
                    value={mode}
                    onChange={onChangeMode}
                    options={arrayModes}
                    isClearable
                    placeholder={mode}
                    />
            </label>
            <br></br>
            <button className="btn btn-success btn-round-1" onClick={onSaveChanges}>Save</button>
    </div>)
}


export default Settings;