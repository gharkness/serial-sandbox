// import logo from './logo.svg';
// import './App.css';

import React from "react"

export default class App extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      port: '',
      reading: false,
    }
  }

  componentDidMount() {
    //  Maker sure the browser supports the web-serial-api
    if (!'serial' in navigator) {
      alert('Serial connections are not supported in your browser.')
    } else {
      // navigator.serial.addEventListener('connect', (e) => {
      //   alert("Connected");
      // });
    }
  }

  readPort = async () => {

    if (!this.state.reading) {
      this.setState({
        reading: true,
      })
    } else if (this.state.reading) {
      this.setState({
        reading: false,
      })
      return;
    }

    while(this.state.port.readable) {
      let decoder = new TextDecoder();
      const reader = this.state.port.readable.getReader()
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            reader.releaseLock();
            break;
          }
          console.log(decoder.decode(value))
        }
      } catch (error) {

      } finally {
        reader.releaseLock();
      }
    }
  }

  handlePorts = async () => {

    //  Connect
    if (!this.state.connected) {
      await navigator.serial.requestPort().then((comPort) => {
        this.setState({
          port: comPort,
          connected: true,
        });
        comPort.open({ baudRate: 9600 }).then((e) => {
          alert('Opened')
        });
      });
    //  Disconnect
    } else {  
      await this.state.port.close().then(() => {
        this.setState({
          port: '',
          connected: false,
          reading: false,
        });
        alert('Closed')
      });
    }

  }

  render () {
    return (
      <div>
        <h1>
          {this.state.connected
            ? this.state.port.getInfo().usbVendorId
            : "Not connected"}
        </h1>
        <button onClick={this.handlePorts}>
          {this.state.connected ? "Disconnect" : "Connect"}
        </button>
        <br />
        <button onClick={this.readPort}>
          {this.state.reading ? "Stop" : "Start"}
        </button>
        <br />
        <br />
      </div>
    );
  }
}