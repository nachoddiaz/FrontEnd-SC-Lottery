import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    //Queremos llamar a la función enterRaffle
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    const [precio, setprecio] = useState("0")
    const [numplayers, setnumplayers] = useState("0")
    const [winner, setwinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: precio,
    })

    const { runContractFunction: getPrecioentrada } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getPrecioentrada",
        params: {},
    })

    const { runContractFunction: getNumPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumPlayers",
        params: {},
    })

    const { runContractFunction: getWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getWinner",
        params: {},
    })

    async function UpdateUI() {
        const precioFromCall = (await getPrecioentrada()).toString()
        setprecio(precioFromCall)
        const numplayersFromCall = (await getNumPlayers()).toString()
        setnumplayers(numplayersFromCall)
        const winnerFromCall = (await getWinner()).toString()
        setwinner(winnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            UpdateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        UpdateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notifiaction",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-900 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <p>
                        Precio de la entrada: {ethers.utils.formatUnits(precio, "ether")}{" "}
                        ETH{" "}
                    </p>
                    <p>Hay {numplayers} jugadores en la rifa</p>
                    <p>El último ganador fue {winner}</p>
                    <p>El último ganador fue {winner}</p>

                </div>
            ) : (
                <div>Please, connect your wallet</div>
            )}
        </div>
    )
}
