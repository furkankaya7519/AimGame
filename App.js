import "./App.css";
import { useState, useEffect } from "react";



import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' ,
    },
    title: {
      display: true,
      text: 'YOUR DATA',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [0.577,0.149,0.500,0.785,0.298,0.945,0.621],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ],
};


let numberOfCorrect = 0;
let numberOfIncorrect = 0;
let finished = false;


if(localStorage.getItem('PlayerResults')===null){
  localStorage.setItem('PlayerResults',JSON.stringify([]));
}

if(localStorage.getItem('PlayerLabel')===null){
  localStorage.setItem('PlayerLabel',JSON.stringify([]));
}

function App() {


  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isManVisible, setIsManVisible] = useState(false);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [randomLeft, setRandomLeft] = useState(0);
  const [randomTop, setRandomTop] = useState(0);
  const [time, setTime] = useState(60);
  const [startTimer, setStartTimer] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  let counter = 0;


  const buttonHandler = () => {
    setIsButtonVisible(false);
    setIsManVisible(true);
    setIsTimeVisible(true);
    setStartTimer(true);
  };

  useEffect(()=>{
    let intervalId = null;
    if(startTimer){
      intervalId = setInterval(() => {
          setRandomLeft(Math.floor(Math.random() * 900));
          setRandomTop(Math.floor(Math.random() * 350));
      }, 1000);
    }
    else{
      clearInterval(intervalId);
    }

    let intervalId2 = null;
    if(startTimer){
      intervalId2 = setInterval(() => {
          setTime(t => t - 1);
          counter += 1;
          if(counter == 60){
            setIsButtonVisible(true);
            setIsTimeVisible(false);
            setIsManVisible(false);
            setIsFinished(true);
            finished = true;
            clearInterval(intervalId);
            clearInterval(intervalId2);

            
          }
      }, 1000);
    }
    else{
      clearInterval(intervalId2);
    }
  },[startTimer])

 

  const manHandler = () => {

    if(counter != 60){
      setCorrect(c => c + 1);
      setIncorrect(i => i  - 1);
      numberOfCorrect += 1;
      numberOfIncorrect -= 1;
    }
  };


  const divHandler = () => {
    if(counter != 60){
      setIncorrect(i => i + 1);
      numberOfIncorrect += 1;
    }
  };

 
  
  if(isFinished){
    let result = numberOfCorrect/(numberOfCorrect+numberOfIncorrect);

    result = result.toFixed(3);


    localStorage.setItem('PlayerResults',JSON.stringify([...JSON.parse(localStorage.getItem('PlayerResults')),result]));


    

    localStorage.setItem('PlayerLabel',JSON.stringify([...JSON.parse(localStorage.getItem('PlayerLabel')),
    
    ((JSON.parse(localStorage.getItem('PlayerLabel'))).length) + 1
    ]));

    

    return (
      <div className="container mt-5 p-5">
        <div className="row  border border-success p-5">
          <div className="col-12 text-center">
            <h2>YOUR SUCCESS RATE: {result}</h2>
          </div>

          <div className="col-12 text-center">
          <button
              className="btn btn-secondary"
              style={
                isButtonVisible ? { display: "inline" } : { display: "none" }
              }
              onClick={()=>{
                window.location.reload();
              }}
            >
              PLAY AGAIN
            </button>
          </div>

        </div>

        <br />
        <hr style={{backgroundColor:'red'}}/>

        <div className="row  p-5 mt-5">
          <div className="col-12 text-center">
            <Line options={options} data={{
              labels:JSON.parse(localStorage.getItem('PlayerLabel')),
              datasets: [
                {
                  label: 'Dataset 1',
                  data: JSON.parse(localStorage.getItem('PlayerResults')),
                  borderColor: 'rgb(255, 99, 132)',
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
              ],
            }} />
          </div>

          <div className="col-12 text-center">
              
          </div>

        </div>




      </div>
    )
  }else{
    return (
      <div className="container mt-2">
  
        <div className="row p-5">
          <div className="col-4 mb-5">
            <h4
              className="text-center time"
              style={isTimeVisible ? { display: "block" } : { display: "none" }}
            >
              Remaning Time : {time}
            </h4>
          </div>
  
          <div className="col-4 mb-5">
            <h4
              className="text-center time correct"
              style={isTimeVisible ? { display: "block" } : { display: "none" }}
            >
              Correct Shot : {correct}
            </h4>
          </div>
  
          <div className="col-4 mb-5">
            <h4
              className="text-center time"
              style={isTimeVisible ? { display: "block" } : { display: "none" }}
            >
              Incorrect Shot : {incorrect}
            </h4>
          </div>
  
          <div
            className="col-12 border border-primary p-5"
            style={{ height: 500 }}
            onClick={divHandler}
          >
            <img
              src="	https://www.svgrepo.com/show/503992/run-sports-runner.svg"
              width={"10%"}
              style={isManVisible ? { display: "inline", marginLeft:randomLeft, marginTop:randomTop} : { display: "none" }}
              className = "myMan"
              onClick={manHandler}
            />
            
          </div>
  
          <div className="col-12 mb-5 text-center mt-2">
            <button
              className="btn btn-primary"
              style={
                isButtonVisible ? { display: "inline" } : { display: "none" }
              }
              onClick={buttonHandler}
            >
              START THE GAME
            </button>
          </div>
        </div>
      </div>

    );
  }
  }




  


export default App;
