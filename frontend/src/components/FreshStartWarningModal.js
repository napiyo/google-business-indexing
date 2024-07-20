import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import '../styleComponents/freshStartWarningModal.css'

export default function FreshStartWarningModal({open,setopen,StartFreshSearch}) {
  
//   const [open, setopen] = useState(true)
  
    return (
    <div>
<Dialog
        open={open}
        fullWidth={true}
        maxWidth='xs' 
      >
           <DialogTitle id="FreshStartwarning-dialog-title">
         Want to go back on search page
        </DialogTitle>
        <DialogContent>
          The current results will not be saved.<br /> are you sure you want to delete current results and want to go back on search page ?
        </DialogContent>
        <DialogActions>
            <Button
            variant='contained'
            onClick={()=>setopen(false)} >cancel</Button>
            <Button color='error' onClick={()=>{

              setopen(false)
              StartFreshSearch()
            }}>proceed</Button>
        </DialogActions >
</Dialog>
        
    </div>
  )
}
