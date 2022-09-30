import './App.css';
import {useGoogleOneTapLogin} from 'react-google-one-tap-login';
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import UnitDetail from './unitDetail';



function App() {
  useGoogleOneTapLogin({
    onError: error => console.log(error),
    googleAccountConfigs: {
      client_id: "883826666115-qu3ukpgannhk3iactbhjvvjdc7pthb1f.apps.googleusercontent.com",
      callback: ({credential}) => {
        localStorage.setItem("credentials", credential);
      },
    },
    onSuccess: response => console.log(response),
  });
  return (
    <div className="App">
      <header className="App-header">
        <h1>Whistler Alpine Villa</h1>
      </header>
      <UserUnitList />
    </div>
  );
}

function getUserInfo(){
  console.log( "User Info" );
  const headers = new Headers();
  headers.append('Authorization', 'Bearer ' + localStorage.getItem('credentials'));
  headers.append('Content-Type', 'application/json');
  const request = new Request("https://api.thesmartcellar.com/user",
  {
      method: 'GET',
      headers: headers,
      mode:"cors"
  });
  
  return fetch( request ).then( response => response.json() );
}

function cancelCheckIn(link, setDirtyFlag) {
  console.log( "Cancel : " + link);
  const headers = new Headers();
  headers.append('Authorization', 'Bearer ' + localStorage.getItem('credentials'));
  headers.append('Content-Type', 'application/json');
  const request = new Request("https://api.thesmartcellar.com" + link,
  {
      method: 'DELETE',
      headers: headers,
      mode:"cors",
  });
  
  return fetch( request ).then( (response) => {response.json(); setDirtyFlag(true); } );
}

function modifyCheckIn(link, unitNumber, checkOutDate, vehicleLicense, setDirtyFlag) {
  console.log( "Modify : " + link);
  const headers = new Headers();
  headers.append('Authorization', 'Bearer ' + localStorage.getItem('credentials'));
  headers.append('Content-Type', 'application/json');
  const request = new Request("https://api.thesmartcellar.com" + link,
  {
      method: 'PUT',
      headers: headers,
      mode:"cors",
      body:JSON.stringify({
        unitNumber: unitNumber,
        checkOutDate:checkOutDate,
        vehicleLicense: vehicleLicense
      })
  });
  
  return fetch( request ).then( (response) => {response.json(); setDirtyFlag(true); } );
}

function UserUnitList(props){
  const [units, setUnitsValue] = React.useState([]);
  const [dirty, setDirtyFlag] = React.useState(true);

  useEffect(() => {
    if ( dirty ){
      getUserInfo().then( (responseJson) => { setUnitsValue( responseJson.units ); setDirtyFlag(false); });
    }
    
  });

  return (
    <Box sx={{width: '100%', bgcolor: 'background.paper'}}>
      <nav aria-label="unit list">
        <List>
          {units.map( unit => { 
            if (unit.unitStatus === 'Available' ){
              return (
                <UnitDetail unitNumber={unit.unitNumber} unitStatus={unit.unitStatus}/>
              );}             
            else{
              
              return (
                <UnitDetail 
                  key={unit.unitNumber}
                  unitNumber={unit.unitNumber} 
                  unitStatus={unit.unitStatus} 
                  checkInDate={unit.activeCheckIn.checkInDate} 
                  checkOutDate={unit.activeCheckIn.checkOutDate} 
                  vehicleLicense={''}
                  cancelCheckInHandler={cancelCheckIn} 
                  modifyCheckInHandler={modifyCheckIn}
                  cancelCheckInLink={unit.links.cancelCheckIn}
                  modifyCheckInLink={unit.links.modifyCheckIn}
                  setDirtyFlag={setDirtyFlag} 
                />
              );}
            }
          )} 
        </List>
      </nav>
    </Box>  
  )

}


export default App;
