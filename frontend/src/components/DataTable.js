import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import '../styleComponents/dataTable.css'
import React, { useEffect, useState } from 'react'
import FreshStartWarningModal from './FreshStartWarningModal';
import {PieChart} from '@mui/x-charts';


export default function DataTable({result,progressData,totalDomainsCount,StartFreshSearch}) {
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolledDown(scrollTop > 50); // Adjust scroll value as needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



   const [showFreshStartWarningAlert, setshowFreshStartWarningAlert] = useState(false);

      const columns = [
        { field: 'domain', headerName: 'Domain', flex:0.5 ,
        description:
        'website URL',
        headerClassName:'dataTable_header'
      },
      
      { field: 'businessName', headerName: 'Business Name', minWidth: 200,flex:1 ,
        description:
        'Business name on google',
        headerClassName:'dataTable_header'
      },
        { field: 'isBusiness', headerName: 'Business found ?', minWidth: 150,
        description:
        'is domain found as business on google ',
        headerClassName:'dataTable_header'
      },
      { field: 'domainLinked', headerName: 'Domain linked ?', minWidth: 150,
        description:
        'is domain linked to business',
        headerClassName:'dataTable_header',
        renderCell: (params) => {
          const value = params.value;
          if (value === 'NA' || value === 'NF' || value ==="err") {
            return <span>{value}</span>;
          }
          if(value === true)
          {
            return <span>true</span>
          }
          else {
            return (
              <a href={value} target="_blank" rel="noopener noreferrer">
                Link
              </a>
            );
          } 
        },
      },
      ];
      const timeCal = {
        hh:Math.floor(progressData.timeElapsed/(60*60)),
        mm:Math.floor((progressData.timeElapsed/60)%60),
        ss:progressData.timeElapsed%60
      }
  return (
    <div className='dataTableBody'>
      <div className='dataTable_result_summary_space'>
        
        <div className={`dataTable_result_summary ${isScrolledDown?'show':''}`} >
        {(isScrolledDown)?<div style={{display:"flex",flexDirection:"column",width:"100%"}}>
        <PieChart
        slotProps={{legend:{hidden:true}}}
        // skipAnimation
  series={[
    {
      data:  [{ value: result.isBusinessCount,label:"Business Found",color:"green" }, 
        { value: result.domainLinkedCount,label:"Domain is linked",color:"aqua"},
         { value: result.errCount,label:"Error while checking" ,color:"crimson"}],
      innerRadius: 20,
      outerRadius: 60,
      paddingAngle: 5,
      cornerRadius: 5,
      startAngle: -90,
      endAngle: 180,
      highlightScope: { faded: 'global', highlighted: 'item' },
      faded: { innerRadius: 20, additionalRadius: -10, color: 'gray' },
    }
  ]}
  height={150}
  width={250}
  
/>
<h3 style={{paddingLeft:40,fontWeight:100}}>Summary</h3></div>
:<div className='dataTable_result_summary_content'>
            
                <h1 style={{fontWeight:'200'}}>Summary</h1>
                <div> <div>Checked</div> <div>{progressData.checkedDomainsCount} / {totalDomainsCount}</div> </div>
                {/* <Divider color="#fffff" sx={{width:"100%"}}/> */}
                <div> <div>Time Taken</div> {timeCal.hh<10?`0${timeCal.hh}`:timeCal.hh}:{timeCal.mm<10?`0${timeCal.mm}`:timeCal.mm}:{timeCal.ss<10?`0${timeCal.ss}`:timeCal.ss}</div> 
                {/* <Divider color="#fffff" sx={{width:"100%"}}/> */}
                <div><div>Business found</div> <div>{result.isBusinessCount}/{progressData.checkedDomainsCount}</div></div>
                {/* <Divider color="#fffff" sx={{width:"100%"}}/> */}
                <div><div>Domains Linked</div> <div>{result.domainLinkedCount}/{result.isBusinessCount}</div></div>
                {/* <Divider color="#fffff" sx={{width:"100%"}}/> */}
                <div><div>Error</div> <div>{result.errCount}/{progressData.checkedDomainsCount}</div></div>
                 </div>}
        </div>
  </div>
        <div className="dataTableBox">

    <DataGrid rows={result.rows} columns={columns} components={{ Toolbar: GridToolbar }} 
    disableSelectionOnClick 
    autoHeight
    disableColumnMenu 
    getRowClassName={(data)=> (data.row.isBusiness===true)? "dataTableRow_true":(data.row.isBusiness===false)?"dataTableRow_false":"dataTableRow_error"}
    
  sx={{border:"none"}}
    />
        </div>
        <button className='analyseFreshBtn' onClick={()=>setshowFreshStartWarningAlert(true)}>Analyse more domains</button>
  {(showFreshStartWarningAlert)?<FreshStartWarningModal open={showFreshStartWarningAlert} setopen={setshowFreshStartWarningAlert} StartFreshSearch={StartFreshSearch}/>:""}
  </div>
  )
}
