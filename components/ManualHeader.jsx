import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function ManualHeader(){

    const {enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis()

    //Para no darle a conectar cada vez que F5
    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window!== "undefined"){
            if (window.localStorage.getItem("connected")){
                enableWeb3()
            }
        }
        console.log(isWeb3Enabled)
    }, [isWeb3Enabled])


    //Para que no salte metamask cada vez que F5
    useEffect(() =>{
        Moralis.onAccountChanged((account) =>{
            console.log(`Account changed to ${account}`)
            if(account ==null){
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    return(<div>
        {account ? 
        (<div>
            Web connected to {account.slice(0,6)}...
            {account.slice(account.length - 4)}
        </div>)
        : 
        (<button 
            onClick={async () =>{
                await enableWeb3()
                if (typeof window!== "undefined"){
                    window.localStorage.setItem("connected", "inject")}
            }}
            disabled = {isWeb3EnableLoading}
        >
          Connect
        </button>)} 
        
    </div>)
}