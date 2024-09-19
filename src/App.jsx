import React, { useState, useEffect, createContext } from 'react';
import axios from "axios"
import moment, { tz } from 'moment-timezone';
function App() {
  const [status, setStatus] = useState('');
  const [TimeFormat, setTimeFormat] = useState(''); /// -06:00 this 
  const [DateFormat, setDateFormat] = useState(''); /// -06:00 this 
  const [CliTimeFormat, setCliTimeFormat] = useState(''); /// -06:00 this 
  const [CliDateFormat, setCliDateFormat] = useState(''); /// -06:00 this 
  const [Progress, setProgress] = useState(1);
  const [ClientTimeZone, setClientTimeZone] = useState('');
  const [data, setdata] = useState("")  
  const [ip, setip] = useState("")
  const [tz, settz] = useState('')
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; //ameraican/nework
    settz(tz)
    const now = moment.tz(tz); // Get current time in Eastern Time

    setTimeFormat(now.format('Z')); // Get UTC offset (e.g., -05:00)
    setDateFormat(now.format('YYYY-MM-DD HH:mm:ss')); // Format the date

    axios.get(`https://api.ipify.org/?format=json`).then(ip => {
      setip(ip.data.ip)
      axios.get(`https://ipinfo.io/${ip.data.ip}/json?token=ffb3890ba7b618`).then(data => {
        setdata(data.data)
        {/*<==========================================
                      start of ip details
                      ===========================================>*/}
        setClientTimeZone(data.data.timezone)
        const clienow = moment.tz(data.data.timezone); // Get current time in Eastern Time
        setCliTimeFormat(clienow.format('YYYY-MM-DD HH:mm:ss')); // Format the date
        setCliDateFormat(clienow.format('Z')); // Get UTC offset (e.g., -05:00)
        {/*<============ end pf  ip details ============*/ }
      }).catch(err => {
        console.log(err)
      })

    })

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (ClientTimeZone !== tz) {
          if (prev <= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 1; // Increment by 1 each tick
        }
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1; // Increment by 1 each tick
      });

    }, 50); // Adjust the speed here
    return () => clearInterval(interval); // Cleanup on unmount
  }, [ip, ClientTimeZone, Progress]);

  return (
    <div className='w-full min-h-screen h-auto bg-gray-900 flex items-center justify-center pt-[10rem] pb-[3rem] text-white relative flex-col' >
      <div className='absolute top-3 uppercase font-bold tracking-widest text-slate-600 text-base sm:text-xl md:text-2xl  lg:text-3xl'><h1>tech bangla unlimited</h1></div>
      <div className='absolute left-3 top-2'>
        <h1 className='text-xl font-bold tracking-widest'>TBU</h1>
      </div>

      <div className='text-white z-30'>
        <div className='flex items-center space-x-4'>
          <div className='w-[3rem] h-[2rem]'>
            {data && <img className='w-full h-full object-cover' src={`https://flagsapi.com/${data.country}/shiny/64.png`} />}
          </div>
          {data &&
            <h1 className='text-white'>{data.timezone}</h1>
          }
        </div>

        <div>
          {data && <h1 className='text-center text-xl sm:text-2xl md:text-3xl font-bold my-2 mx-2'>{ip}</h1>}
        </div>
      </div>
      {/*<==========================================
                      start of tracking
          ===========================================>*/}
      <div className='w-[90%] h-[2rem] relative bg-slate-800 rounded-full overflow-hidden'>
        <div style={{ width: `${Progress}%` }} className={`h-full bg-green-600 transition-all duration-700`}></div>
        <h1 className='absolute inset-0 flex items-center justify-center z-0'>
          {Progress}%
        </h1>
      </div>
      {/*<============ end pf  tracking ============*/}
      {/*<==========================================
                    start of main
                    ===========================================>*/}
      <div className='flex flex-wrap items-start justify-start mx-3 gap-4 my-6 mt-7'>
        <div className='text-start'>
          <h1>ISP: {data && data.org}</h1>
          <h1>Country : {data && data.country}</h1>
        </div>
        <div className='text-start'>
          <h1>City : {data && data.city}</h1>
          <h1>Region : {data && data.region}</h1>
        </div>
      </div>
      {/*<==========================================
                    start of wrong
        ===========================================>*/}
      <div className={`${data.timezone === tz ?"bg-green-500":"bg-red-600"} w-[90%] max-w-[30rem] flex flex-wrap items-center justify-around sm:justify-around space-x-4 space-y-5 mt-5 px-2 py-2`}>
        <div>
          <h1 className='text-white text-xl capitalize'>local Timezone</h1>
          <div>
            <h1>{tz}</h1>
            <p>{TimeFormat && TimeFormat}</p>
            <p>{DateFormat}</p>
          </div>
        </div>
        <div>
          <h1 className='text-white text-xl capitalize'>ip Timezone</h1>
          <div>
            <h1>{data && data.timezone}</h1>
            <p>{data && CliDateFormat}</p>
            <p>{data && CliTimeFormat}</p>
          </div>
        </div>
      </div>

      {/*<============ end pf  wrong . ============*/}
      {/*<============ end pf  main ============*/}
    </div>
  );
}

export default App;
