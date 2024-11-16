import React, { useEffect, useState } from 'react';
import './Rates.css'
import { useTable } from 'react-table'
import { useToast } from '../../Context/Toast/ToastContext';
import axios from 'axios';

const Rates = () => {
    const [rates, setRates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredRates, setFilteredRates] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [currentRate, setCurrentRate] = useState({
        idRates: null,
        idLocation: null,
        idCurrency: null,
        date: null,
        value: null
    });
    const { showToastMessage } = useToast();

    const fetchRates = () => {
        const token = localStorage.getItem('user-token');
        axios.get(`http://localhost:3000/rate`,
            {
                headers: {
                    Authorization: `Bearer ${token}` // send the token in the Authorization header
                }
            })
            .then(response => {
                if (response.data.success) {
                    setRates(response.data.result);
                    setFilteredRates(response.data.result);
                }
                else {
                    console.error('Failed to fetch rates');
                    showToastMessage('Failed to fetch rates');
                    if (response?.data?.error === 'No authorization header') {
                        localStorage.removeItem('user-token');
                        window.rate.href = '/dashboard';
                    }
                }

            })
            .catch(error => {
                console.error(error);
                showToastMessage('Failed to fetch rates: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response.error === 'No authorization header') {
                    localStorage.removeItem('user-token');
                    window.rate.href = '/dashboard';
                }
            });
    };
    useEffect(() => {
        fetchRates();
        setIsLoading(false);
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        filter(value);
    };

    const filter = (value) => {

    };

    var data = React.useMemo(() => filteredRates, [filteredRates]);
    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "idRates",
            },
            {
                Header: "Address",
                accessor: "address",
            },
            {
                Header: "Currency",
                accessor: "name",
            },
            {
                Header: "Date",
                accessor: "date",
            },
            {
                Header: "Value",
                accessor: "value",
            },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <div className='actions-container'>
                        <button onClick={() => handleUpdate(row.original)} type="button" className="btn btn-primary btn-update" data-bs-toggle="modal" data-bs-target="#modal-rate">
                            Update
                        </button>
                        <button className="btn-delete">
                            <span onClick={() => deleteRate(row.original)} className="delete-message">CONFIRM DELETE</span>
                            <svg className="delete-svg" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2" >
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ),
            }
        ],
        []
    );

    const handleUpdate = (rate) => {
        console.log("Button clicked for rate: ", rate);
        setCurrentRate(rate);
    };

    const deleteRate = (rate) => {
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.delete(`http://localhost:3000/rate/delete`, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            },
            data: {
                idRates: rate.idRates // Pass the idrate in the data field
            }
        })
            .then(response => {
                if (response.data.success) {
                    showToastMessage('Successfully deleted rate');
                    setRates(rates.filter(r => r.idRates !== rate.idRates));
                } else {
                    console.error('Failed to delete rate');
                    showToastMessage('Failed to delete rate');
                    if (response.data.error === 'No authorization header') {
                        localStorage.removeItem('user-token');
                        window.rate.href = '/dashboard';
                    }
                }
            })
            .catch(error => {
                showToastMessage('Could not delete rate: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header') {
                    localStorage.removeItem('user-token');
                    window.rate.href = '/dashboard';
                }
            })
    };

    const handleInsertClick = () => {
        resetRate();
    };

    const resetRate = () => {
        setCurrentRate({
            idRates: null,
            idrate: null,
            idCurrency: null,
            date: null,
            value: null
        });
    };

    const insertRate = () => {
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.post(`http://localhost:3000/rate/insert`, {
            idLocation: currentRate.idLocation,
            idCurrency: currentRate.idCurrency,
            date: currentRate.date,
            value: currentRate.value
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            }
        })
            .then(response => {
                if (response.data.success) {
                    showToastMessage('Successfully inserted rate');
                    fetchRates();
                    //filter(searchValue);
                    resetRate();
                } else {
                    console.error('Failed to insert rate');
                    showToastMessage('Failed to insert rate');
                    if (response.data.error === 'No authorization header') {
                        localStorage.removeItem('user-token');
                        window.rate.href = '/dashboard';
                    }
                }
            })
            .catch(error => {
                showToastMessage('Could not insert rate: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header') {
                    localStorage.removeItem('user-token');
                    window.rate.href = '/dashboard';
                }
            });
    };

    const updateRate = () => {
        console.log("Updating rate with id: ", currentRate.idrate);
        const token = localStorage.getItem('user-token'); // Retrieve the token from local storage
        axios.put(`http://localhost:3000/rate/update`, {
            idRates: currentRate.idRates,
            idLocation: currentRate.idLocation,
            idCurrency: currentRate.idCurrency,
            date: currentRate.date,
            value: currentRate.value
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Send the token in the Authorization header
            }
        })
            .then(response => {
                if (response.data.success) {
                    showToastMessage('Successfully updated rate');
                    /*setRates(rates.map(rate =>
                        rate.idRates === currentRate.idRates ? {
                            ...rate, address: currentRate.address
                            , latitude: currentRate.latitude, longitude: currentRate.longitude, information: currentRate.information
                        } : rate
                    ));
                    setFilteredRates(filteredRates.map(rate =>
                        rate.idrate === currentRate.idrate ? {
                            ...rate, address: currentRate.address
                            , latitude: currentRate.latitude, longitude: currentRate.longitude, information: currentRate.information
                        } : rate
                    ));*/
                } else {
                    console.error('Failed to update rate');
                    showToastMessage('Failed to update rate');
                }
            })
            .catch(error => {
                showToastMessage('Could not update rate: ' + (error.response?.data?.error || 'Unknown error'));
                if (error.response?.data?.error === 'No authorization header') {
                    localStorage.removeItem('user-token');
                    window.rate.href = '/dashboard';
                }
            });
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });
    return (
        <div>
            <div class="input-group mb-3 search-box">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">@</span>
                </div>
                <input
                    className='form-control'
                    type="text"
                    placeholder="Search by name"
                    value={searchValue}
                    onChange={handleSearch}
                    style={{ marginBottom: 20 }}
                />
            </div>
            <div id="rate-table" className="table-container">
                {isLoading ? (<h1>Loading rates...</h1>) : (<table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                )}
            </div>
            <button onClick={() => handleInsertClick()} type="button" class="btn btn-primary btn-insert" data-bs-toggle="modal" data-bs-target="#modal-rate">
                Insert
            </button>
            <div id="modal-rate" class="modal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">rate</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <input
                                type="date"
                                className="form-control rate-input"
                                value={currentRate.date || ''}
                                onChange={(e) => setCurrentRate({ ...currentRate, date: e.target.value })}
                                placeholder="Enter date"
                            />
                            <input
                                type="number"
                                className="form-control rate-input"
                                value={currentRate.value !== null ? currentRate.value : ''}
                                onChange={(e) => setCurrentRate({ ...currentRate, value: e.target.value })}
                                placeholder="Enter value"
                            />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => currentRate.idrate === null ? insertRate() : updateRate()}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Rates;