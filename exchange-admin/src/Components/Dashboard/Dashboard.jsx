import React from 'react';
import Navbar from './Navbar'
import './Dashboard.css'
import logo from '../Assets/logo.png'

const Dashboard = () => {

    return (
        <div>
            <Navbar />
            <img className="logo" src={logo} alt="" />
            <h1>DASHBOARD</h1>
        </div>
    );
}

export default Dashboard;