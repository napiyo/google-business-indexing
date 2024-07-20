import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';

import '../styleComponents/progressModal.css'
import { CircularProgress, Divider } from '@mui/material';
export default function ProgressModal({progressData,stopProcess,totalDomainsCount}) {

 
// if user click stop show warning
const [showStopWarning, setshowStopWarning] = React.useState(false)
  
const showStopWarningAlert =()=>{

    setshowStopWarning(true)
}

// if user confirm stop process
const [showLoading, setshowLoading] = React.useState(false)

// show loading.. while current domain is processing and then close it
const stopConfirm = ()=>{
setshowLoading(true);
stopProcess();
}

    
  return (
    <Dialog
        open={progressData.isProcessing}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth='sm'
        
      >
        {
          (showLoading)?<div style={{display:'flex',width:'100%',height:300,justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>

            <CircularProgress />
            completing current domain before terminating process...
          </div>
           :<>
        
        <DialogTitle id="progress-dialog-title">
          {"We're checking Business Presence on Google"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              <div style={{display:"flex",width:"100%",columnGap:"20px",alignItems:'center'}}>

          <LinearProgress variant="determinate" value={(progressData.checkedDomainsCount/totalDomainsCount)*100} style={{width:"90%"}}/>
                     {Math.floor((progressData.checkedDomainsCount/totalDomainsCount)*100) + "%"}
              </div>
                            <Divider style={{margin:"20px 0"}}/>
              <div className="progressIndicatorsContainer">
                  <div className="progressIndicatorContainer">
                      <div>Time elapsed</div>
                      <div>{Math.floor(progressData.timeElapsed/60)} min {progressData.timeElapsed%60} sec</div>
                  </div>
                  <div className="progressIndicatorContainer">
                      <div>Total domains checked </div>
                      <div>{progressData.checkedDomainsCount} / {totalDomainsCount}</div>
                  </div>
                  <div className="progressIndicatorContainer">
                      <div>Expected Time Remaining </div>
                      <div>
                      { (progressData.checkedDomainsCount===0)?"calculating.."
                      :  Math.floor(progressData.timeRemaining/60) + " min " + Math.floor(progressData.timeRemaining%60) + " sec "

}</div>
                  </div>

     
              </div>
              <div className={(showStopWarning)?"StopWarningAlert show":"StopWarningAlert"}>
               <h3>Are you sure?</h3>
                 process can not be resume. you will get results for {progressData.checkedDomainsCount} domains only. 
                 <DialogActions>
          <Button onClick={()=>setshowStopWarning(false)} >keep processing</Button>
          <Button variant='contained' color='error' onClick={stopConfirm}>Stop</Button>
        </DialogActions>
              </div>
          </DialogContentText>
        </DialogContent>
     {(showStopWarning)?"":

       <DialogActions>
          {/* <Button >Run in background</Button> */}
          <Button variant='contained' color='error' onClick={showStopWarningAlert}>Stop</Button>
        </DialogActions>
        }
         </>
}
      </Dialog>
    
  );
}