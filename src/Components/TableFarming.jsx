import {Table} from 'react-bootstrap';
import React from 'react';

export const TableFarming = (props) => {
    const {
        dataFarmingFrom, 
        dataFarmingTo,
        } = props
    const keysFrom = Object.keys(dataFarmingFrom)
    const keysTo = Object.keys(dataFarmingTo)
    return (
        <div>
            Данные по поступлению с адреса контракта 0x9d943fd36add58c42568ea1459411b291ff7035f на адресс пользователя (общие суммы за все время)
            <Table striped bordered hover variant="dark" style={{marginBottom: '40px'}}>
            {keysFrom.map((k) => {
                return (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{dataFarmingFrom[k]}</td>
                    </tr>
                )
            })}
            </Table>
            Данные по поступлению с адреса пользователя на адресс контракта 0x9d943fd36add58c42568ea1459411b291ff7035f (общие суммы за все время)
            <Table striped bordered hover variant="dark" style={{marginBottom: '40px'}}>
            {keysTo.map((k) => {
                return (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{dataFarmingTo[k]}</td>
                    </tr>
                )
            })}
            </Table>
        </div>
    )
}