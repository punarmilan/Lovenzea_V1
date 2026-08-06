import React from 'react'
import SentEmpty from './AllRequest'

function Received() {
    return (
        <div className="min-h-screen pb-20  pt-4 xs:pt-6 sm:pt-8 overflow-x-hidden">
            
            {/* Main Container with Responsive Padding */}
            <div className="flex flex-col lg:flex-row max-w-[1920px] mx-auto">
               
            {/* <InboxRequestsPage /> */}
            <SentEmpty />
        </div>
        </div>

    )
}

export default Received