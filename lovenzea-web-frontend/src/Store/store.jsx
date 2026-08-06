import { configureStore } from "@reduxjs/toolkit";
import userSlice from '../Slice/UserSlice';
import dashboardSlice from '../Slice/DashboardSlice';
import profileSlice from '../Slice/ProfileSlice';
import notificationSlice from '../Slice/NotificationSlice';
import eventSlice from '../Slice/EventSlice';
import matchSlice from '../Slice/MatchSlice';

import chatSlice from '../Slice/ChatSlice';
import reportSlice from '../Slice/ReportSlice';
import adminAuthReducer from '../admin/store/adminAuthSlice';

const store = configureStore({
    reducer: {
        user: userSlice,
        dashboard: dashboardSlice,
        profile: profileSlice,
        notifications: notificationSlice,
        events: eventSlice,
        match: matchSlice,

        chat: chatSlice,
        report: reportSlice,
        adminAuth: adminAuthReducer
    },
    devTools: true
})

export default store