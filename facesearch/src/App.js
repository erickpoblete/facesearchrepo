import React, { Component } from 'react';
import Clarifai from 'clarifai'
import Navigation from './Components/Navigation/Navigation';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';


const app = new Clarifai.App({
  apiKey: '85f7f205230349eca87905bd30f56440'
 });

const particlesOptions = {
  particles: {
    line_linked: {
      number: {
        value: 140,
        density: {
          enable: true,
          value_area:800
        }
      }
      }
    }
  }

class App extends Component{
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box: {},
      route: 'Signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.initModel({
      id: Clarifai.FACE_DETECT_MODEL
    })
      .then((faceDetectModel) => {
          return faceDetectModel.predict(this.state.input);
        })
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
   }

   onRouteChange = (route) =>{
     if (route === 'Signout') {
       this.setState({isSignedIn: false})
     } else if (route === 'home') {
       this.setState({isSignedIn: true})
     }
     this.setState({route: route});
   }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
      <Navigation isSignedIn={isSignedIn}onRouteChange={this.onRouteChange} />
      {route === 'home' 
        ? <div>
          <Logo />
          <Rank />
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}   
          />
          <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
        : (
          route === 'Signin' 
          ? <Signin onRouteChange={this.onRouteChange}/>
          : <Register onRouteChange={this.onRouteChange}/>
          )
      }
        </div>
    );
  }
}

export default App;
