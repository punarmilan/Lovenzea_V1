import React from 'react'
import Header from '../components/Headers'
import SecondNav from '../components/SecondNav'
import { Outlet } from 'react-router-dom'

function MyShadi() {
    return (
        <div>
            <Header />
            <SecondNav />
            {/* Main content area with padding */}
            <div className="pt-20"> {/* Adjust based on Header + SecondNav height */}
                {/* <Outlet /> */}
            </div>
        </div>
    )
}

export default MyShadi