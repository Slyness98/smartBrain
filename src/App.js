import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './components/ImageLinkForm/ImageLinkForm.css';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js'
import './App.css';
import 'tachyons';




const particleOptions= {  
  "particles": {
    "number": {
       "value": 60,
       "density":{
          "enable": true,
          "value_area": 2000
        }
    },
     "color":{
       "value":"#FFF"
    }
  }
};


const initialState = {
  input: '',
  imageUrl:'',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    email: '',
    name: '',
    entries: 0,
    joined: ''  
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: { 
        id: data.id,
        email: data.email,
        name: data.name,
        entries: data.entries,
        joined: data.joined
    }})
  }
  calculateFaceLocation = (data) => {
      console.log(data, data.regions.length);


      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      let i = data.regions.length;
      

      while(i--) {
        const clarifaiFace = data.regions[i].region_info.bounding_box;
        let obj = {leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)};
          this.state.box.push(obj)
        
      }
      console.log(this.state.box);
  }
  
  


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
     fetch('https://radiant-peak-18434.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
           input: this.state.input
          })
      })
    .then(response => response.json())
    .then(response => {
      if(response){
        fetch('https://radiant-peak-18434.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
           id: this.state.user.id
          })
      })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries:count}))
        })
    }
      let mapResults = Object.fromEntries(Object.entries(response.outputs[0].data).map(([key, value]) => [key, value])
      );
      this.clearBoxState();
      this.calculateFaceLocation(mapResults);
    })
   .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route ==='home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route });

  }


  clearState = (clearState) => { 
    this.setState(initialState)
  }

  clearBoxState = () => {
    this.setState({box: []})
  }

  // iterate = (box) => {
  //   return(
  //      <div className='bounding-box' style= {{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}> </div>
  //   );
  // }
 //pass this clearState variable to Navigation component in order to 
//clear images displayed in app from one user to the next. 
//Bug can't be fixed by manipulating onRouteChange routes without compromising other functionalities

  render() {
    const { isSignedIn, imageUrl, route, box} = this.state;
    
    return (
      <div className="App">
      <Particles 
        className="particles"
        params={particleOptions}
      />

     <Navigation clearState={this.clearState} isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
     {route === 'home'
   
     ? <div className="homeContainer"> 
       <Logo />
       <Rank name={this.state.user.name} entries={this.state.user.entries}/>
       <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}
       />
       
        
       <FaceRecognition box={box} imageUrl={imageUrl} />
        
         
       </div>
      :(
        this.state.route=== 'signin'
        ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
      }
      </div>
      
    );
  };
}

export default App;
