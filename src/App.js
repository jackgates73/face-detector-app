import React, { Component } from 'react';
import Navigation from './components/navigation/navigation';
import Logo from './components/logo/logo';
import ImageLinkForm from './components/imageLinkForm/imageLinkForm';
import Rank from './components/rank/rank';
import FaceRecognition from './components/faceRecognition/faceRecognition';
import Signin from './components/signIn/signIn';
import Register from './components/register/register';
import Particles from 'react-particles-js';

import './App.css';



const particlesOptions = {
  particles: {
    number:{
      value:30,
      density:{
        enable:true,
        value_area: 200
      }
    },
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
}

const initialState = {
  input:'',
  imageUrl: '',
  box:{},
  route: 'signin',
  isSignedIn: false,
  user: {
    id:'',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  }
}
 
class App extends Component{
  constructor() {
    super();
    this.state = initialState;
    console.log(this.state.imageUrl);
  }


loadUser = (data) => {
  this.setState(initialState);
  this.setState({user: {
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined,
  }})
}
  
calculateFaceLocaton = (data)=>{
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return{
    leftCol:clarifaiFace.left_col * width,
    topRow:clarifaiFace.top_row * height,
    rightCol:width - (clarifaiFace.right_col * width),
    bottomRow:height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  this.setState({box: box});
}

onInputChange =(event) => {
  this.setState({input: event.target.value});
}

onButtonSubmit=()=>{
  this.setState({imageUrl: this.state.input});
  fetch('https://calm-cliffs-08678.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input:this.state.input
      })
  })
  .then(response => response.json())
  .then(response => {
    if (response){
      fetch('https://calm-cliffs-08678.herokuapp.com/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id:this.state.user.id
        })
      })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, { entries: count }))
      })
      .catch(console.log)
    }
    this.displayFaceBox(this.calculateFaceLocaton(response))
  })
  .catch(err=> console.log(err));
}

onRouteChange = (route) =>{
  if (route === 'signout'){
    this.setState({initialState})
  } else if(route === 'home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

render(){
      const { isSignedIn, imageUrl, route, box } = this.state;
      return (
        <div className="App">
          <Particles className='particles'
            params={particlesOptions}        
          />
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
          { route === 'home' 
            ?<div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
            : (
                route === 'signin' || route === 'signout'
                  ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                  : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )
          }
        </div>
  );
};
};

export default App;
