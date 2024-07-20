// importing required modules

import "./App.css";
import Alert from "@mui/material/Alert";
import {Slide } from "@mui/material";
import { useEffect, useState } from "react";
import ProgressModal from "./components/ProgressModal";
import DataTable from "./components/DataTable";
import api from "./utils/ApiConfing";




// import end

// main App functional component
function App() {

  useEffect(() => {
    
    // warning on reload
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
  
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  
    
  
  }, []);
  // raw domain text - "abc.com \n def.com \n" and total domains count
  const [domains, setdomains] = useState({
    domainsData: "",
    totalDomainsCount: 0,
  });

  // alert snakbar for empty field warning or already in process - error
  const [alertData, setalertData] = useState({
    show: false,
    msg: "this is error alert",
  });



  // data for showing progress
  let initialProgressData = {
    isProcessing: false,
    checkedDomainsCount: 0,
    timeRemaining: 0,
    timeElapsed: 0,
    showResults: false,
  };
  const [progressData, setprogressData] = useState({ ...initialProgressData });
  // time in seconds

  // to stop process
  const [terminateProcess, setterminateProcess] = useState(false);

 if(terminateProcess){}

  const [result, setresult] = useState({rows:[],isBusinessCount:0,domainLinkedCount:0,errCount:0});

  // main function that checks indexing for google news

  const analyse = async () => {
    // if domains are empty show alert
    if ( !domains.domainsData || domains.domainsData.trim().length === 0) {
      // if already alert is shown- do nothing
     
      if (alertData.show && alertData.msg === "domains names can not be empty") {
        return;
      }
      setalertData({ show: true, msg: "domains names can not be empty" });
      // hide alert in 3s
      setTimeout(() => {
        setalertData({ show: false, msg: "this is error alert" });
      }, 3000);

      return;
    }
    // if already processing - show alert
    if (progressData.isProcessing) {
      // if alert is already visible - do nothing
      if (
        alertData.show &&
        alertData.msg === "another task is already processing, please wait.."
      ) {
        return;
      }
      setalertData({
        show: true,
        msg: "another task is already processing, please wait..",
      });
      // hide alert after 3s
      setTimeout(() => {
        setalertData({ show: false, msg: "this is error alert" });
      }, 3000);
      return;
    }

    // start checking for indexing

    // get domains name from raw domain  data as array
    let domainArray = domains.domainsData.split("\n");

    // set progress data to initial values - except isProcessing
    setprogressData((data) => ({ ...initialProgressData, isProcessing: true }));

    let temp_timeElapsed = 0;
    // update time elapsed
    let timeElapsedTimer = setInterval(() => {
      // increase timeElapsed - by one second after each second
      temp_timeElapsed++;
      setprogressData((data) => ({ ...data, timeElapsed: temp_timeElapsed }));
    }, 1000);

    // stores results in a temp array
    let temp_results = [];
    // check index for each domain stored in domainArray

    /* eslint-disable no-loop-func */
    let temp_terminate = false;
    let temp_isBusinessCount=0;
    let temp_domainLinkedCount=0;
    let temp_errCount=0;
    for (let i = 0; i < domainArray.length; i++) {
      // terminate process- stoped by user
      setterminateProcess((state)=>{
        temp_terminate=state;
        return state;
      })
      if (temp_terminate) {
        setprogressData((data) => ({
          ...data,
          isProcessing: false,
          showResults: true,
        }));
        
        break;
      }
      
      if (domainArray[i].trim().length === 0) {
        // if domain is not last - and is empty dont check for indexing. just increase checked domain count.
        // if it is last domain and empty we have already exclude it in total domain count - in updateDomain function
        if (i !==domainArray.length - 1) {
          setprogressData((data) => ({
            ...data,
            checkedDomainsCount: data.checkedDomainsCount + 1,
          }));
        }
        
        continue;
      }

      // call api - response = {success:true ,domain:abc.com , isBusiness:true,title: abc, website:abc.com }
      // call api - response = {success:true ,domain:abc.com , isBusiness:false}
      // call api - response = {success:false ,message:errMsg}


      await api.get(`/api/checkBusiness/`,{ params: { domain: domainArray[i] }}).then((res)=>{
        // put result data in temp_results array
        if(res.data.isBusiness)
        {
          temp_isBusinessCount++;
          if(res.data.website === true) temp_domainLinkedCount++;
          temp_results.push( { id: i+1, 
            domain: domainArray[i],
            isBusiness:true,
            businessName: res.data.title,
            domainLinked:res.data.website})
        }
        else{
          temp_results.push( { id: i+1, 
            domain: domainArray[i],
            isBusiness:false,
            businessName: "NA",
            domainLinked:"NA"})
        }
  
      }).catch((e)=>{
        temp_errCount++;
        temp_results.push( { id: i+1, domain: domainArray[i], businessName:e.response?.data?.message || `unknown err`,isBusiness:"err",domainLinked:"err"})      
      })
      
      // avg time took for a single domain * remaing domains count
      //i+1 == checked domains count
      let temp_timeRemaining =
      (temp_timeElapsed / (i + 1)) * (domains.totalDomainsCount - i - 1);
      temp_timeRemaining = Math.floor(temp_timeRemaining);
      setprogressData((data) => ({
        ...data,
        timeRemaining: temp_timeRemaining,
        checkedDomainsCount: i + 1,
      }));
    }
    // update result
    setresult((data)=>({rows:[...temp_results],isBusinessCount:temp_isBusinessCount,domainLinkedCount:temp_domainLinkedCount,errCount:temp_errCount}))
    // close time elpased time interval
    clearInterval(timeElapsedTimer);
    // update progress data
    setprogressData((data) => ({
      ...data,
      isProcessing: false,
      showResults: true,
    }));
  };

  // update domains name and total count as user types
  const updatedomains = (event) => {
    let tempDomainsArray = event.target.value.split("\n").map(line => line.trim())
    .filter(line => line !== '');
    let temp_length= tempDomainsArray.length;

    setdomains((data) => ({ domainsData:event.target.value, totalDomainsCount: temp_length }));
  };

  // remove results and reset everything
  const StartFreshSearch = () => {
    setresult({rows:[],indexedCount:0,nonIndexedCount:0});
    setterminateProcess(false);
    setdomains({domainsData:[],totalDomainsCount:0})
    setprogressData({ ...initialProgressData });
  };


  // called by progress modal
  const stopProcess = ()=>{

  setterminateProcess(true);
   
  }

  return (
    <div className="App">
      {/* hide search box if processing or showing results  */}
      <div
        style={{
          height: "100vh",
          zIndex:"22",
          display:
            progressData.isProcessing || progressData.showResults
              ? "none"
              : "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="searchBox">
          <h1>check domains for google business</h1>

<div style={{position:"relative"}}>

          <textarea
            name="domainsInptField"
            id="domainsInptField"
            spellCheck="false"
            placeholder={"Enter each domain in single line \nabc.com\ndef.in\nefgsa.co.in"}
              value={domains.domainsData}
              onChange={(e) => updatedomains(e)}
              >

          </textarea>
           <div className="line-count">{domains.totalDomainsCount}</div>
            </div>
          
          {/* start analyse button  */}
          <button id="analyseBtn" onClick={analyse}>
            Analyse<span className="icon-right"></span>
            <span className="icon-right after"></span>
          </button>
          {/* start analyse button  end */}
            </div>
            {/* search box ends  */}

          {/* alert for empty domains  */}
          <div className="alertContainer">
            {alertData.show ? (
            <Slide direction="up" in={alertData.show} mountOnEnter unmountOnExit>
              
              <Alert severity="error" variant="filled" >{alertData.msg}</Alert>
            </Slide>
            ) : (
              ""
            )}
          </div>
          {/* alert ends */}
        </div>
      
      {/*  progress dialog  */}
      <div>
        {progressData.isProcessing ? (
          <ProgressModal
           progressData={progressData}
           stopProcess={stopProcess}
            totalDomainsCount={domains.totalDomainsCount}
          />
        ) : (
          ""
        )}
      </div>
      {/* progress dialog ends  */}

      {/* results  */}
      {progressData.showResults ? (
        <DataTable
          result={result}
          progressData={progressData}
          totalDomainsCount={domains.totalDomainsCount}
          StartFreshSearch={StartFreshSearch}
        />
      ) : (
        ""
      )}
     {/* results ends  */}

    </div>
  );
}

export default App;
