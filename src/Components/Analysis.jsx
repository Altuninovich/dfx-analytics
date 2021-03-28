import React from 'react';
import {ProgressBar, Container, Badge, Alert} from 'react-bootstrap';

export class Analysis extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputDfxPancakeSwap: null, 
            outputDfxPancakeSwap: null, 
            percentInputDfxPancakeSwap: 0, 
            percentOutputDfxPancakeSwap: 0,
            inputDfxFarmingPool: null, 
            outputDfxFarmingPool: null, 
            percentInputDfxFarmingPool: 0, 
            percentOutputDfxFarmingPool: 0,
            percentInputDfxStaking: null, 
            percentOutputDfxStaking: null,
            inputDfxStaking: 0,
            outputDfxStaking: 0

        }
    }

    updateExchangerData = async () => {
        const url = 'https://api.bscscan.com/api?module=account&action=tokentx&address=0xe7ff9aceb3767b4514d403d1486b5d7f1b787989&startblock=0&endblock=25000000&sort=asc&apikey='
        try {
            const response = await fetch(url, {method: 'GET'})
            let {result} = await response.json()
            const numberSeconds = 86400 //количество секунд в сутках, для фильтрации данных за сутки
            const exchangerHash = "0xe7ff9aceb3767b4514d403d1486b5d7f1b787989"
            const startPoint = result[result.length - 1].timeStamp - numberSeconds
            const transactionsPerDay = result.filter(({timeStamp, tokenSymbol}) => timeStamp > startPoint && tokenSymbol === "DFX")
            const returnDfx = transactionsPerDay.filter(({to}) => to === exchangerHash) //транзакции по возврату DFX
            const acceptedDfx = transactionsPerDay.filter(({from}) => from === exchangerHash) //транзакции по обмену на DFX
            const quantityReturnDfx = returnDfx.reduce((acc, el) => acc + el.value / (10 ** 18), 0) //сумма возврата DFX
            const quantityAcceptedDfx = acceptedDfx.reduce((acc, el) => acc + el.value / (10 ** 18), 0) // сумма обмена на DFX
            const totalSumDfx = quantityReturnDfx + quantityAcceptedDfx
            this.setState({
                inputDfxPancakeSwap: quantityReturnDfx,
                outputDfxPancakeSwap: quantityAcceptedDfx,
                percentInputDfxPancakeSwap: quantityReturnDfx * 100 / totalSumDfx,
                percentOutputDfxPancakeSwap: quantityAcceptedDfx * 100 / totalSumDfx
            })
                        
        } catch (error) {
            
        }
    }

    updateDataFarmingPool = async () => {
        const url = 'https://api.bscscan.com/api?module=account&action=tokentx&address=0x9d943FD36adD58C42568EA1459411b291FF7035F&startblock=0&endblock=25000000&sort=asc&apikey='
        try {
            const response = await fetch(url, {method: 'GET'})
            let {result} = await response.json()
            const numberSeconds = 86400 //количество секунд в сутках, для фильтрации данных за сутки
            const farmingPoolHash = "0x9d943fd36add58c42568ea1459411b291ff7035f"
            const startPoint = result[result.length - 1].timeStamp - numberSeconds
            const transactionsPerDay = result.filter(({timeStamp, tokenSymbol}) => timeStamp > startPoint && tokenSymbol === "DFX")
            const inputPool = transactionsPerDay.filter(({to}) => to === farmingPoolHash) //вход в пул
            const outputPool = transactionsPerDay.filter(({from}) => from === farmingPoolHash) //выход из пула
            const totalSumAddPool = inputPool.reduce((acc, el) => acc + el.value / (10 ** 18), 0) //сумма поступления в пул
            const totalSumFromPool = outputPool.reduce((acc, el) => acc + el.value / (10 ** 18), 0) // сумма выхода из пула
            const totalSum = totalSumAddPool + totalSumFromPool
            this.setState({
                inputDfxFarmingPool: totalSumAddPool, 
                outputDfxFarmingPool: totalSumFromPool, 
                percentInputDfxFarmingPool: totalSumAddPool * 100 / totalSum,
                percentOutputDfxFarmingPool: totalSumFromPool * 100 / totalSum
            })
        } catch (error) {
            
        }
    }

    updateDataDfxStaking = async () => {
        const url = 'https://api.bscscan.com/api?module=account&action=tokentx&address=0x11340dC94E32310FA07CF9ae4cd8924c3cD483fe&startblock=0&endblock=25000000&sort=asc&apikey='
        try {
            const response = await fetch(url, {method: 'GET'})
            let {result} = await response.json()
            const numberSeconds = 86400 //количество секунд в сутках, для фильтрации данных за сутки
            const dfxStakingHash = "0x11340dc94e32310fa07cf9ae4cd8924c3cd483fe"
            const startPoint = result[result.length - 1].timeStamp - numberSeconds
            const transactionsPerDay = result.filter(({timeStamp}) => timeStamp > startPoint)
            const inputStaking = transactionsPerDay.filter(({to}) => to === dfxStakingHash) //вход в staking
            const outputStaking = transactionsPerDay.filter(({from}) => from === dfxStakingHash) //выход из staking
            const totalSumAddStaking = inputStaking.reduce((acc, el) => acc + el.value / (10 ** 18), 0) //сумма поступления в staking
            const totalSumFromStaking = outputStaking.reduce((acc, el) => acc + el.value / (10 ** 18), 0) // сумма выхода из staking
            const totalSum = totalSumAddStaking + totalSumFromStaking
            this.setState({
                inputDfxStaking: totalSumAddStaking, 
                outputDfxStaking: totalSumFromStaking, 
                percentInputDfxStaking: totalSumAddStaking * 100 / totalSum,
                percentOutputDfxStaking: totalSumFromStaking * 100 / totalSum
            })
        } catch (error) {
            
        }
    }

    getDataAnalysis = () => {
        this.updateDataFarmingPool()
        this.updateExchangerData()
        this.updateDataDfxStaking()
    }

    startAnalysis = () => {
        this.timerId = setInterval(this.getDataAnalysis, 30000)
    }

    componentDidMount() {
        this.getDataAnalysis()
        this.startAnalysis()
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
      }

    render() {
        const {
            percentInputDfxPancakeSwap, 
            percentOutputDfxPancakeSwap, 
            inputDfxPancakeSwap, 
            outputDfxPancakeSwap,
            percentInputDfxFarmingPool,
            percentOutputDfxFarmingPool,
            inputDfxFarmingPool,
            outputDfxFarmingPool,
            percentInputDfxStaking, 
            percentOutputDfxStaking, 
            inputDfxStaking, 
            outputDfxStaking
        } = this.state
    return (
        <>
        <div>
          <p><strong>Информация по обмену токена DFX</strong></p>
          BUSD-DFX сумма - <Badge variant="success">{inputDfxPancakeSwap}</Badge>
          <ProgressBar variant="success" now={percentInputDfxPancakeSwap} label={`${percentInputDfxPancakeSwap}%`} />
          DFX-BUSD сумма - <Badge variant="danger">{outputDfxPancakeSwap}</Badge>
          <ProgressBar variant="danger" now={percentOutputDfxPancakeSwap} label={`${percentOutputDfxPancakeSwap}%`} />
        </div>
        <Alert variant={'dark'}></Alert>
        <Alert variant={'dark'}></Alert>
        <div>
          <p><strong>Информация по обороту на Dfx-FarmingPool</strong></p>
          поступление на Dfx-FarmingPool - <Badge variant="success">{inputDfxFarmingPool}</Badge>
          <ProgressBar variant="success" now={percentInputDfxFarmingPool} label={`${percentInputDfxFarmingPool}%`} />
          выход из Dfx-FarmingPool - <Badge variant="danger">{outputDfxFarmingPool}</Badge>
          <ProgressBar variant="danger" now={percentOutputDfxFarmingPool} label={`${percentOutputDfxFarmingPool}%`} />
      </div>
      <Alert variant={'dark'}></Alert>
      <Alert variant={'dark'}></Alert>
      <div>
          <p><strong>Информация по обороту на Dfx-Staking</strong></p>
          поступление на Dfx-Staking - <Badge variant="success">{inputDfxStaking}</Badge>
          <ProgressBar variant="success" now={percentInputDfxStaking} label={`${percentInputDfxStaking}%`} />
          выход из Dfx-Staking - <Badge variant="danger">{outputDfxStaking}</Badge>
          <ProgressBar variant="danger" now={percentOutputDfxStaking} label={`${percentOutputDfxStaking}%`} />
      </div>
      <Alert variant={'dark'}></Alert>
      <Alert variant={'dark'}></Alert>
      </>
    )
    }
}