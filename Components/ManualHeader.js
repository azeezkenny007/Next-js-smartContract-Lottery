import React,{useEffect} from 'react'
import {useMoralis} from 'react-moralis'


function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled,Moralis,deactivateWeb3,isWeb3EnableLoading } = useMoralis();

  useEffect(() => {
    // To allow the user connect if connected exist in the local storage
     //    1. On clicking the connect button the user set connected using the localStorage.setItem method i.e localStorage.setItem("connected","injected")
    //     2. if the connected exist in the localStorage enableWeb3 i.e This means that so far connected exist in localStorage , the wallet should be connected
    //     3. This useEffect reruns only when the state of the isWeb3Loading == true || false
        
   if(isWeb3Enabled) return
        if(typeof window !=="undefined"){
            if(localStorage.getItem("connected")){
                 enableWeb3()
            }
        }
    console.log(isWeb3Enabled)
  }, [isWeb3Enabled])
  
            // This useEffect monitors whether an account has changed or not
            // 1. if the account connected to the wallet has changed it displays this message
             //                               |
             //                               V
             //          console.log(`Account changed to ${account}`)
             // 2. But if an account doesn't exist then it performs the following actions
              //   1. deletes the item set action that allows the DOM to know an account exist
             //    2. it then deactivates the connection that exist between the browser and the wallet
             //    3. it then logs the "no account found" message to the console
  useEffect(()=>{
      Moralis.onAccountChanged((account)=>{
         console.log(`Account changed to ${account}`)
         if(account == null){
          localStorage.removeItem("connected")
          deactivateWeb3()
          console.log("no account found")
         }
      })
  },[])


  return (
    <div>
      {account 
      ? (<div>Connected to {account.slice(0,6)}...{account.slice(account.length - 4)}</div>) 
      :( <button onClick={async()=>{
                await enableWeb3()
                if(typeof window !=="undefined"){
                  localStorage.setItem("connected", "injected");
                }              
      }} disabled={isWeb3EnableLoading}>Connect</button>)}
      
    </div>
  )
}

export default ManualHeader