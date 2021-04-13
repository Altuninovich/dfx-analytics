import {Table} from 'react-bootstrap';
import React from 'react';

export const TableTotalReceiptAmount = (props) => {
    const {totalReceiptsFromUniqueAddresses, totalAmountOfItemsSentToUniqueAddresses, address} = props

    const keysFrom = Object.keys(totalReceiptsFromUniqueAddresses).filter((k) => k !== address)
    const keysTo = Object.keys(totalAmountOfItemsSentToUniqueAddresses).filter((k) => k !== address)
    return (
        <div>
            Все суммы токена DFX поступившие c уникальных адресов на адрес пользователя (происходит фильтрация по
            уникальным адресам и сложение всех сумм отправленных за все время на адрес пользователя).
            <Table striped bordered hover variant="dark" style={{marginBottom: '40px'}}>
                {keysFrom.map((k) => {
                    return (
                        <tr key={k}>
                            <td>{k}</td>
                            <td>{totalReceiptsFromUniqueAddresses[k]}</td>
                        </tr>
                    )
                })}
            </Table>
            Все суммы токена DFX поступившие от адреса пользователя на уникальные адреса (происходит фильтрация по
            уникальным адресам и сложение всех сумм отправленных за все время на эти адреса пользователем).
            <Table striped bordered hover variant="dark">
                {keysTo.map((k) => {
                    return (
                        <tr key={k}>
                            <td>{k}</td>
                            <td>{totalAmountOfItemsSentToUniqueAddresses[k]}</td>
                        </tr>
                    )
                })}
            </Table>
        </div>
    )
}