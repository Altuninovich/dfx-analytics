import React from 'react';
import {ProgressBar, Container, Badge, Alert} from 'react-bootstrap';


const numberSeconds = 86400 //количество секунд в сутках, для фильтрации данных за сутки

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
            outputDfxStaking: 0,
            totalSumPancake: 0,
            totalSumFarming: 0,
            totalSumStaking: 0,
            diffBetweenCurrentAndPreviousDayPancakeSwap: '',
            diffBetweenCurrentAndPreviousDayFarmingPool: '',
            diffBetweenCurrentAndPreviousDayStaking: ''

        }
    }

    roundNum = (n) => Math.floor(n * 100) / 100

    getDiffPercent = (sumCurrent, sumPrevious) => {
        const dif = sumCurrent - sumPrevious
        if (dif < 0) {
            return `${Math.floor(100 * dif / sumPrevious)}%`
        }
        return `+${Math.floor(100 * dif / sumCurrent)}%`
    }

    updateExchangerData = async () => {
        const url = 'https://api.bscscan.com/api?module=account&action=tokentx&address=0xe7ff9aceb3767b4514d403d1486b5d7f1b787989&startblock=0&endblock=25000000&sort=asc&apikey='
        try {
            const response = await fetch(url, {method: 'GET'})
            let {result} = await response.json()
            const exchangerHash = "0xe7ff9aceb3767b4514d403d1486b5d7f1b787989"
            const startPoint = result[result.length - 1].timeStamp - numberSeconds
            const transactionsPerDay = result.filter(({timeStamp, tokenSymbol}) => timeStamp > startPoint && tokenSymbol === "DFX")
            const returnDfx = transactionsPerDay.filter(({to}) => to === exchangerHash) //транзакции по возврату DFX
            const acceptedDfx = transactionsPerDay.filter(({from}) => from === exchangerHash) //транзакции по обмену на DFX
            const quantityReturnDfx = this.roundNum(returnDfx.reduce((acc, el) => acc + el.value / (10 ** 18), 0)) //сумма возврата DFX
            const quantityAcceptedDfx = this.roundNum(acceptedDfx.reduce((acc, el) => acc + el.value / (10 ** 18), 0)) // сумма обмена на DFX
            const totalSumDfx = quantityReturnDfx + quantityAcceptedDfx

            //получаем сумму за предыдущие сутки
            const startPointForThePreviousDay = result[result.length - 1].timeStamp - 172800
            const totalSumDfxForThePreviousDay = result
                .filter(({timeStamp, tokenSymbol}) => timeStamp > startPointForThePreviousDay && timeStamp < startPoint && tokenSymbol === "DFX")
                .reduce((acc, el) => acc + el.value / (10 ** 18), 0)


            this.setState({
                inputDfxPancakeSwap: quantityReturnDfx,
                outputDfxPancakeSwap: quantityAcceptedDfx,
                percentInputDfxPancakeSwap: this.roundNum(quantityReturnDfx * 100 / totalSumDfx),
                percentOutputDfxPancakeSwap: this.roundNum(quantityAcceptedDfx * 100 / totalSumDfx),
                totalSumPancake: totalSumDfx,
                diffBetweenCurrentAndPreviousDayPancakeSwap: this.getDiffPercent(totalSumDfx, totalSumDfxForThePreviousDay)
            })

        } catch (error) {

        }
    }

    updateDataFarmingPool = async () => {
        const url = 'https://api.bscscan.com/api?module=account&action=tokentx&address=0x9d943FD36adD58C42568EA1459411b291FF7035F&startblock=0&endblock=25000000&sort=asc&apikey='
        try {
            const response = await fetch(url, {method: 'GET'})
            let {result} = await response.json()
            const farmingPoolHash = "0x9d943fd36add58c42568ea1459411b291ff7035f"
            const startPoint = result[result.length - 1].timeStamp - numberSeconds
            const transactionsPerDay = result.filter(({timeStamp, tokenSymbol}) => timeStamp > startPoint && tokenSymbol === "DFX")
            const inputPool = transactionsPerDay.filter(({to}) => to === farmingPoolHash) //вход в пул
            const outputPool = transactionsPerDay.filter(({from}) => from === farmingPoolHash) //выход из пула
            const totalSumAddPool = this.roundNum(inputPool.reduce((acc, el) => acc + el.value / (10 ** 18), 0)) //сумма поступления в пул
            const totalSumFromPool = this.roundNum(outputPool.reduce((acc, el) => acc + el.value / (10 ** 18), 0)) // сумма выхода из пула
            const totalSum = totalSumAddPool + totalSumFromPool

            const startPointForThePreviousDay = result[result.length - 1].timeStamp - 172800
            const totalSumDfxForThePreviousDayFarmingPool = result
                .filter(({timeStamp, tokenSymbol}) => timeStamp > startPointForThePreviousDay && timeStamp < startPoint && tokenSymbol === "DFX")
                .reduce((acc, el) => acc + el.value / (10 ** 18), 0)
            this.setState({
                inputDfxFarmingPool: totalSumAddPool,
                outputDfxFarmingPool: totalSumFromPool,
                percentInputDfxFarmingPool: this.roundNum(totalSumAddPool * 100 / totalSum),
                percentOutputDfxFarmingPool: this.roundNum(totalSumFromPool * 100 / totalSum),
                totalSumFarming: totalSum,
                diffBetweenCurrentAndPreviousDayFarmingPool: this.getDiffPercent(totalSum, totalSumDfxForThePreviousDayFarmingPool)
            })
        } catch (error) {

        }
    }

    updateDataDfxStaking = async () => {
        const url = 'https://api.bscscan.com/api?module=account&action=tokentx&address=0x11340dC94E32310FA07CF9ae4cd8924c3cD483fe&startblock=0&endblock=25000000&sort=asc&apikey='
        try {
            const response = await fetch(url, {method: 'GET'})
            let {result} = await response.json()
            const dfxStakingHash = "0x11340dc94e32310fa07cf9ae4cd8924c3cd483fe"
            const startPoint = result[result.length - 1].timeStamp - numberSeconds
            const transactionsPerDay = result.filter(({timeStamp}) => timeStamp > startPoint)
            const inputStaking = transactionsPerDay.filter(({to}) => to === dfxStakingHash) //вход в staking
            const outputStaking = transactionsPerDay.filter(({from}) => from === dfxStakingHash) //выход из staking
            const totalSumAddStaking = this.roundNum(inputStaking.reduce((acc, el) => acc + el.value / (10 ** 18), 0)) //сумма поступления в staking
            const totalSumFromStaking = this.roundNum(outputStaking.reduce((acc, el) => acc + el.value / (10 ** 18), 0)) // сумма выхода из staking
            const totalSum = totalSumAddStaking + totalSumFromStaking

            const startPointForThePreviousDay = result[result.length - 1].timeStamp - 172800
            const totalSumDfxForThePreviousDayStaking = result
                .filter(({timeStamp, tokenSymbol}) => timeStamp > startPointForThePreviousDay && timeStamp < startPoint)
                .reduce((acc, el) => acc + el.value / (10 ** 18), 0)
            this.setState({
                inputDfxStaking: totalSumAddStaking,
                outputDfxStaking: totalSumFromStaking,
                percentInputDfxStaking: this.roundNum(totalSumAddStaking * 100 / totalSum),
                percentOutputDfxStaking: this.roundNum(totalSumFromStaking * 100 / totalSum),
                totalSumStaking: totalSum,
                diffBetweenCurrentAndPreviousDayStaking: this.getDiffPercent(totalSum, totalSumDfxForThePreviousDayStaking)
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
        this.timerId = setInterval(this.getDataAnalysis, 200000)
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
            outputDfxStaking,
            totalSumPancake,
            totalSumFarming,
            totalSumStaking,
            diffBetweenCurrentAndPreviousDayPancakeSwap,
            diffBetweenCurrentAndPreviousDayFarmingPool,
            diffBetweenCurrentAndPreviousDayStaking

        } = this.state

        const getPercent = (val) => this.roundNum(val * 100 / (totalSumPancake + totalSumFarming + totalSumStaking))
        let percentPancake = getPercent(totalSumPancake)
        let percentFarming = getPercent(totalSumFarming)
        let percentStaking = getPercent(totalSumStaking)
        return (
            <>
                <Alert variant={'dark'}>Все суммы указаны в DFX.Данные берутся за последние 24 часа и обновляются каждые
                    30 секунд.</Alert>
                <div style={{marginBottom: '40px'}}>
                    <p><strong>Информация по обмену токена DFX</strong></p>
                    BUSD-DFX сумма - <Badge variant="success">{inputDfxPancakeSwap}</Badge>
                    <ProgressBar variant="success" now={percentInputDfxPancakeSwap}
                                 label={`${percentInputDfxPancakeSwap}%`}/>
                    DFX-BUSD сумма - <Badge variant="danger">{outputDfxPancakeSwap}</Badge>
                    <ProgressBar variant="danger" now={percentOutputDfxPancakeSwap}
                                 label={`${percentOutputDfxPancakeSwap}%`}/>
                </div>
                <div style={{marginBottom: '40px'}}>
                    <p><strong>Информация по обороту на Dfx-FarmingPool</strong></p>
                    поступление на Dfx-FarmingPool сумма - <Badge variant="success">{inputDfxFarmingPool}</Badge>
                    <ProgressBar variant="success" now={percentInputDfxFarmingPool}
                                 label={`${percentInputDfxFarmingPool}%`}/>
                    выход из Dfx-FarmingPool сумма - <Badge variant="danger">{outputDfxFarmingPool}</Badge>
                    <ProgressBar variant="danger" now={percentOutputDfxFarmingPool}
                                 label={`${percentOutputDfxFarmingPool}%`}/>
                </div>
                <div style={{marginBottom: '50px'}}>
                    <p><strong>Информация по обороту на Dfx-Staking</strong></p>
                    поступление на Dfx-Staking сумма - <Badge variant="success">{inputDfxStaking}</Badge>
                    <ProgressBar variant="success" now={percentInputDfxStaking} label={`${percentInputDfxStaking}%`}/>
                    выход из Dfx-Staking сумма - <Badge variant="danger">{outputDfxStaking}</Badge>
                    <ProgressBar variant="danger" now={percentOutputDfxStaking} label={`${percentOutputDfxStaking}%`}/>
                </div>
                <div style={{marginBottom: '60px'}}>
                    <p><strong>Информация по общему обороту</strong></p>
                    оборот на PancakeSwap - <Badge
                    variant="dark">{`${totalSumPancake} (разница с предыдущими сутками: ${diffBetweenCurrentAndPreviousDayPancakeSwap})`}</Badge>
                    <ProgressBar striped variant="success" now={percentPancake} label={`${percentPancake}%`}/>
                    оборот на Farming - <Badge
                    variant="dark">{`${totalSumFarming} (разница с предыдущими сутками: ${diffBetweenCurrentAndPreviousDayFarmingPool})`}</Badge>
                    <ProgressBar striped variant="info" now={percentFarming} label={`${percentFarming}%`}/>
                    оборот на Dfx-Staking - <Badge
                    variant="dark">{`${totalSumStaking} (разница с предыдущими сутками: ${diffBetweenCurrentAndPreviousDayStaking})`}</Badge>
                    <ProgressBar striped variant="warning" now={percentStaking} label={`${percentStaking}%`}/>
                </div>
            </>
        )
    }
}
