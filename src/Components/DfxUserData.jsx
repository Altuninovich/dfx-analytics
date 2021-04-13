import {Button, Spinner, Col, Form, Table, Row} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {TableFarming} from './TableFarming';
import {TableTotalReceiptAmount} from './TableTotalReceiptAmount';


const sortByUniqueValue = (dataBy, sortBy) => {
  const result = dataBy.reduce((acc, el) => {
    if (acc.hasOwnProperty(el[sortBy])) {
      let value = Number(el.value) / (10 ** 18)
      let currentValue = acc[el[sortBy]]
      let newValue = currentValue + value
      acc[el[sortBy]] = newValue
      return acc
    }
    let value = Number(el.value) / (10 ** 18)
    acc[el[sortBy]] = value
    return acc
  }, {})
  return result
}

export const DfxUserData = () => {
  const [address, setAddress] = useState('')
  const [dfx, setDfx] = useState(0)
  const [stDfx, setStDfx] = useState(0)
  const [dDai, setDdai] = useState(0)
  const [cakeLp, setCakeLp] = useState(0)
  const [dfUsdtLp, setdfUsdtLp] = useState(0)
  const [dfDaiLp, setdfDaiLp] = useState(0)
  const [dfBtcLp, setdfBtcLp] = useState(0)
  const [dfBusdLp, setdfBusdLp] = useState(0)
  const [inDfxSteking, setinDfxSteking] = useState(0)
  const [outDfxSteking, setOutDfxSteking] = useState(0)
  const [differenceInOutDfx, setdifferenceInOutDfx] = useState(0)
  const [totalReceiptsFromUniqueAddresses, setTotalReceiptsFromUniqueAddresses] = useState(null)
  const [totalAmountOfItemsSentToUniqueAddresses, settotalAmountOfItemsSentToUniqueAddresses] = useState(null)
  const [inStDfx, setinStDfx] = useState(0)
  const [outStDfx, setOutStDfx] = useState(0)
  const [differenceInOutStDfx, setdifferenceInOutStDfx] = useState(0)
  const [tokenTransaction, setDataTokenTransactions] = useState(null)
  const [dataFarmingFrom, setDataFarmingFrom] = useState({})
  const [dataFarmingTo, setDataFarmingTo] = useState({})
  const [errorAddress, setErrorAddress] = useState(false)

  const contracts = {
    dfx: '0x74b3abb94e9e1ecc25bd77d6872949b4a9b2aacf',
    stDfx: '0x11340dc94e32310fa07cf9ae4cd8924c3cd483fe',
    dDai: '0x308853aec7cf0ecf133ed19c0c1fb3b35f5a4e7b',
    cakeLp: '0xe7ff9aceb3767b4514d403d1486b5d7f1b787989',
    dfUsdtLp: '0xb7552a0463515bda8b47ab7503ca893e52c58df8',
    dfDaiLp: '0x8427d2ed4a4c0a88b773b34f5b78b1903b529a22',
    dfBtcLp: '0xdae114f3deb7bcaef97ab53c3cd25bebf4014eae',
    dfBusdLp: '0x987f04dece1c5ae9e69cf4f93d00bbe2ca5af98c',
    farming: '0x9d943fd36add58c42568ea1459411b291ff7035f',
  }

  const roundNum = (n) => Math.floor(n * 100) / 100

  const stDfxTransactions = () => {
    if (tokenTransaction) {
      const stDfxTransactions = tokenTransaction.filter((el) => el.tokenSymbol === "stDFX")
      const addressOutStDfxFromSteking = '0x0000000000000000000000000000000000000000'
      const valueInStDfx = sortByUniqueValue(stDfxTransactions, 'from')[addressOutStDfxFromSteking]
      const valueOutStDfx = sortByUniqueValue(stDfxTransactions, 'to')[addressOutStDfxFromSteking]
      setinStDfx(valueInStDfx)
      setOutStDfx(valueOutStDfx)
      setdifferenceInOutStDfx(valueInStDfx && valueInStDfx - valueOutStDfx)
    }
    return
  }

  const transactionByFarming = async () => {
    if (tokenTransaction) {
      const response = await fetch(
          'https://api.bscscan.com/api?module=account&action=tokentx&address=0x9d943fd36add58c42568ea1459411b291ff7035f&startblock=0&endblock=25000000&sort=asc&apikey='
          , {method: 'GET'}
      )
      let {result} = await response.json()
      const inFar = result.filter((el) => el.to === address) //когда на адреc пользователя
      const outFar = result.filter((el) => el.from === address) //когда от адреса пользователя
      const dataInFar = sortByUniqueValue(inFar, 'tokenSymbol')
      const dataOutFar = sortByUniqueValue(outFar, 'tokenSymbol')
      setDataFarmingFrom(dataInFar)
      setDataFarmingTo(dataOutFar)
    }
    return
  }

  const queryUrlforDfxTransactions = async () => {

    const url = `https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=25000000&sort=asc&apikey=`
    const response = await fetch(url, {method: 'GET'})
    let data = await response.json()
    setDataTokenTransactions(data.result)

    const dataByDfx = data.result.filter((el) => el.tokenSymbol === "DFX")
    const dataFrom = sortByUniqueValue(dataByDfx, 'from')
    const dataTo = sortByUniqueValue(dataByDfx, 'to')
    setTotalReceiptsFromUniqueAddresses(dataFrom)
    settotalAmountOfItemsSentToUniqueAddresses(dataTo)
    const valueInDfxSteking = dataTo[contracts.stDfx]
    const valueOutDfxSteking = dataFrom[contracts.stDfx]
    setinDfxSteking(valueInDfxSteking)
    setOutDfxSteking(valueOutDfxSteking)
    console.log(valueInDfxSteking)
    setdifferenceInOutDfx(valueInDfxSteking && valueInDfxSteking - valueOutDfxSteking)
  }

  const setFun = {
    dfx: setDfx, stDfx: setStDfx, dDai: setDdai,
    cakeLp: setCakeLp, dfUsdtLp: setdfUsdtLp, dfDaiLp: setdfDaiLp,
    dfBtcLp: setdfBtcLp, dfBusdLp: setdfBusdLp
  }

  //чтобы добавить еще запрос, нужно добавить хук, функцию хука в setFun, и адрес в contracts и в setFun

  const tokens = Object.keys(contracts)

  const queryUrlforBalance = async (contract, setData) => {
    const url = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${contract}&address=${address}&tag=latest&apikey=YourApiKeyToken`
    try {
      const response = await fetch(url, {method: 'GET'})
      let {result} = await response.json()

      const normalizeValue = () => {
        if (result !== '0') {
          if (result < 999999999999999999) {
            return '0,' + [...Array(18 - String(result).length)].map((a) => '0').join('') + String(result)
          }
          return roundNum(result / (10 ** 18))
        }
        return '0'
      }
      let newResult = normalizeValue()
      await setData(newResult)

    } catch (error) {

    }
  }

  const getData = async (e) => {
    e.preventDefault()
    if (address.length !== 42) {
      setErrorAddress(true)
      return
    }
    setErrorAddress(false)
    tokens.map((token, i) => {
      let delayTime = (i * 400) + 500
      setTimeout(() => queryUrlforBalance(contracts[token], setFun[token]), delayTime)
    })
    setTimeout(queryUrlforDfxTransactions, 3000)
  }

  useEffect(stDfxTransactions, [tokenTransaction])
  useEffect(transactionByFarming, [tokenTransaction])


  return (
      <div style={{marginBottom: '20px'}}>
        <Form style={{marginBottom: '20px'}}>
          <Form.Row>
            <Col xs={7}>
              <Form.Control
                  onChange={e => setAddress(e.target.value)}
                  type="text" value={address}
                  placeholder="Введите адрес чтобы получить данные"
              />
            </Col>
            <Col>
              <Button onClick={getData} variant="primary" type="submit">
                get data
              </Button>
            </Col>
          </Form.Row>
        </Form>
        <Table striped bordered hover variant="dark" style={{marginBottom: '30px'}}>
          <thead>
          <tr>
            <th>address</th>
            <th>DFX</th>
            <th>stDFX</th>
            <th>dDai</th>
            <th>cakeLp</th>
            <th>DF-USDT-LP</th>
            <th>DF-DAI-LP</th>
            <th>DF-BTC-LP</th>
            <th>DF-BUSD-LP</th>
            <th>Lp farming</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{address}</td>
            <td>{dfx}</td>
            <td>{stDfx}</td>
            <td>{dDai}</td>
            <td>{cakeLp}</td>
            <td>{dfUsdtLp}</td>
            <td>{dfDaiLp}</td>
            <td>{dfBtcLp}</td>
            <td>{dfBusdLp}</td>
            <td>{}</td>
          </tr>
          </tbody>
        </Table>
        <Table striped bordered hover variant="dark" style={{marginBottom: '30px'}}>
          <thead>
          <tr>
            <th>поступление DFX на Dfx-Staking</th>
            <th>выход DFX из Dfx-Staking</th>
            <th>разница в DFX между out-in</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{inDfxSteking}</td>
            <td>{outDfxSteking}</td>
            <td>{differenceInOutDfx && differenceInOutDfx}</td>
          </tr>
          </tbody>
        </Table>
        <Table striped bordered hover variant="dark" style={{marginBottom: '30px'}}>
          <thead>
          <tr>
            <th>получение stDfx</th>
            <th>возврат stDfx</th>
            <th>разница в stDFX между in-out</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{inStDfx}</td>
            <td>{outStDfx}</td>
            <td>{differenceInOutStDfx && differenceInOutStDfx}</td>
          </tr>
          </tbody>
        </Table>
        {dataFarmingTo && Object.keys(dataFarmingTo).length !== 0 && <TableFarming dataFarmingTo={dataFarmingTo}
                                                                                   dataFarmingFrom={dataFarmingFrom}
        />
        }
        {totalAmountOfItemsSentToUniqueAddresses && Object.keys(totalAmountOfItemsSentToUniqueAddresses).length !== 0 &&
        <TableTotalReceiptAmount totalReceiptsFromUniqueAddresses={totalReceiptsFromUniqueAddresses}
                                 totalAmountOfItemsSentToUniqueAddresses={totalAmountOfItemsSentToUniqueAddresses}
                                 address={address}
        />}
      </div>

  )
}
