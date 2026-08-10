import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ChatWindow from "./components/ChatWindow";
import { closeChatWindow, setCurrentUserId } from "./Slice/ChatSlice";
import ChatService from "./services/chatService";
import PremiumMatchDashboard from "./pages/myshadi/matches/PremiumMatchDashboard";
import MatchProfileDetails from "./pages/matches/MatchProfileDetails";
import { Toaster } from "react-hot-toast";
import "./pages/myshadi/partner/partner.css";
import Home from "./pages/Home";
import Dashboard from "./pages/myshadi/dashboard/Dashboard";
import Header from "./components/Headers";
import Footer from "./components/Footer";
import AuthenticatedFooter from "./components/AuthenticatedFooter";
import OnlineMembers from "./components/OnlineMembers";
import LovenZeaSupport from "./components/LovenZeaSupport";
import SecondNav from "./components/SecondNav";
import { getCurrentUser } from "./Slice/UserSlice";
import MyProfile from "./pages/myshadi/myProfile/MyProfile";
import MyPhoto from "./pages/myshadi/myphoto/MyPhoto";
import PartnerPreference from "./pages/myshadi/partner/PartnerPreference";
import Register from "./components/Register";
import Login from "./components/Login";
import HeightRangePage from "./pages/myshadi/partner/HeightRange";
import MaritalStatusPage from "./pages/myshadi/partner/MaritalStatusPage";
import ReligionPage from "./pages/myshadi/partner/ReligionPage";
import Community from "./pages/myshadi/partner/Community";
import MotherTonguePage from "./pages/myshadi/partner/MotherTonguePage";
import AgeRangePage from "./pages/myshadi/partner/AgeRangePage";
import ProfessionPage from "./pages/myshadi/partner/ProfessionPage";
import QualificationPage from "./pages/myshadi/partner/QualificationPage";
import StateLivingPage from "./pages/myshadi/partner/StateLivingPage";
import CityDistrictPage from "./pages/myshadi/partner/CityDistrictPage";
import AnnualIncomePage from "./pages/myshadi/partner/AnnualIncomePage";
// import WorkingWithPage from "./pages/myshadi/partner/WorkingWithPage";
import DietPage from "./pages/myshadi/partner/DietPage";
import ProfileManagedByPage from "./pages/myshadi/partner/ProfileManagedByPage";
import Settings from "./pages/myshadi/setting/Setting";
import Country from "./pages/myshadi/partner/Country";
import MoreDropdown from "./pages/myshadi/more/More";

import InboxNav from "./pages/inbox/InboxNav";
import Received from "./pages/inbox/received/Received";
import Accepted from "./pages/inbox/accepted/Accepted";
import Deleted from "./pages/inbox/deleted/Deleted";
import Requests from "./pages/inbox/requests/Requests";
import Sent from "./pages/inbox/sent/Sent";
import Contacts from "./pages/inbox/contacts/Contacts";
import Payment from "./pages/payment/Payment";
import ContactFilters from "./pages/myshadi/setting/ContactFilters";
import MyOrdersPage from "./pages/MyOrder/MyOrder";
import MyOrder from "./pages/MyOrder/MyOrder";
import ReferPage from "./pages/MyOrder/ReferPage";
import HelpPage from "./pages/MyOrder/HelpPage";
import SecurityPage from "./pages/MyOrder/SecurityPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import MyTickets from "./pages/MyOrder/MyTickets";
import Pricing from "./pages/payment/Pricing";
import AboutUs from "./pages/AboutUs";
import VerifyEmail from "./pages/VerifyEmail";
import OtpVerification from "./pages/OtpVerification";
import api from "./services/api";
import ProtectedRoute from "./components/ProtectedRoute";

//Complete Profile Routes
import CompleteProfile from "./pages/CompleteProfile";
import ReligiousBackgroundForm from "./components/profile/ReligiousBackgroundForm";
import FamilyDetailsForm from "./components/profile/FamilyDetailsForm";
import EducationCareerForm from "./components/profile/EducationCareerForm";
import LocationForm from "./components/profile/LocationForm";
import LifestyleForm from "./components/profile/LifestyleForm";
import PartnerPreferenceForm from "./components/profile/PartnerPreferenceForm";

//Auth Footer Routes import
import BlogPage from "./pages/./authFooter/BlogPage";
import VipLovenZeaPage from "./pages/authFooter/VipLovenZeaPage";
import SuccessStoriesPage from "./pages/authFooter/SuccessStoriesPage";
import CentresPage from "./pages/authFooter/CentresPage";
import ContactPage from "./pages/authFooter/ContactPage";
import LivePage from "./pages/authFooter/LivePage";
import WorkWithUsPage from "./pages/authFooter/WorkWithUsPage";

// New Pages
import Wedding from "./pages/myshadi/wedding/Wedding";
import SpecialServices from "./pages/myshadi/services/SpecialServices";
import Notifications from "./pages/Notifications";
import BeSafeOnline from "./pages/BeSafeOnline";
import WeddingInvite from "./pages/wedding/WeddingInvite";

// Admin Imports
import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminUserManagement from "./admin/pages/AdminUserManagement";
import VerificationQueue from "./admin/pages/VerificationQueue";
import PhotoModeration from "./admin/pages/PhotoModeration";
import ReportManagement from "./admin/pages/ReportManagement";
import AdminLogViewer from "./admin/pages/AdminLogViewer";
import SubscriptionManagement from "./admin/pages/SubscriptionManagement";
import SupportTickets from "./admin/pages/SupportTickets";
import EventManagement from "./pages/admin/EventManagement";
import Contact from "./pages/Contact";
import ContactMessages from "./admin/pages/ContactMessages";
import MobileUsersManagement from "./admin/pages/MobileUsersManagement";
import MobileUserDetails from "./admin/pages/MobileUserDetails";
import { Ban } from 'lucide-react';
import MyShadiLayout from "./layouts/MyShadiLayout";
import PageContainer from "./layouts/PageContainer";
import ChatsPage from "./pages/myshadi/chats/ChatsPage";
import InterestsPage from "./pages/myshadi/interests/InterestsPage";
import ChatListPage from "./pages/myshadi/chats/ChatListPage";
import SavedProfilesPage from "./pages/myshadi/matches/SavedProfilesPage";


function App() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const activeChatUser = useSelector((state) => state.chat.activeChatUser);
  const unreadCount = useSelector((state) => state.chat.unreadCount);
  const notificationsUnreadCount = useSelector((state) => state.notifications.unreadCount);
  const isHomePage = location.pathname === "/" || location.pathname === "/home" || location.pathname === '/payment';
  const isWeddingPage = location.pathname.startsWith('/wedding');
  const isAdminPage = location.pathname.startsWith("/admin");
  const isContactPage = location.pathname === "/contact";

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);

  // Verify session on mount if user is supposedly authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCurrentUser()).unwrap().catch((err) => {
        console.warn('Session verification failed on mount:', err);
      });
    }
  }, [dispatch]); // Only on actual mount

  // Hide OnlineMembers on Home page ONLY
  useEffect(() => {
    if (isHomePage) {
      setOpen(false);
    }
  }, [isHomePage]);

  // Global listener for chats sidebar
  useEffect(() => {
    const handleOpenChats = () => setOpen(true);
    window.addEventListener('open-chats-sidebar', handleOpenChats);
    return () => window.removeEventListener('open-chats-sidebar', handleOpenChats);
  }, []);

  // Activity Heartbeat & CSRF Initialization
  useEffect(() => {
    // Prime CSRF token on every app load (for all users, including non-authenticated)
    api.get("/subscriptions/plans").catch(() => { });

    let intervalId;
    if (isAuthenticated) {
      // Immediate ping on mount/auth
      api.get("/activity/ping").catch(() => { });

      intervalId = setInterval(() => {
        api.get("/activity/ping").catch(() => { });
      }, 60000); // 60 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  // WebSocket Connection
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(setCurrentUserId(user.id));
      ChatService.connect(user.id);
    } else {
      ChatService.disconnect();
    }
  }, [isAuthenticated, user?.id, dispatch]);

  // Handle close button click
  const handleClose = () => {
    setOpen(false);
  };

  // Handle open button click
  const handleOpen = () => {
    if (!isHomePage) {
      setOpen(true);
    }
  };

  return (
    <div className="min-h-screen pb-safe-bottom w-full max-w-[100%] overflow-x-hidden">
      <ToastContainer style={{ zIndex: 999999 }} />
      {/* Online Members Chat Button */}
      {/* Support Chat Bot */}
      {!isAdminPage && (
        <LovenZeaSupport />
      )}
      {/* ROUTES */}
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={
          <>
            <MyShadiLayout>
                <PremiumMatchDashboard />
            </MyShadiLayout>
          </>
          } />
        <Route path="/matches/:id" element={<><MyShadiLayout><MatchProfileDetails /></MyShadiLayout></>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/safety" element={<BeSafeOnline />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/wedding" element={<WeddingInvite />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/be-safe-online" element={<BeSafeOnline />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="mobile-users" element={<MobileUsersManagement />} />
          <Route path="mobile-users/:id" element={<MobileUserDetails />} />
          <Route path="approvals" element={<VerificationQueue />} />
          <Route path="photos" element={<PhotoModeration />} />
          <Route path="reports" element={<ReportManagement />} />
          <Route path="logs" element={<AdminLogViewer />} />
          <Route path="subscriptions" element={<SubscriptionManagement />} />
          <Route path="support" element={<SupportTickets />} />
          <Route path="contacts" element={<ContactMessages />} />
          <Route path="events" element={<EventManagement />} />
        </Route>

        // Complete Profile Routes
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/religious-background-form" element={<ReligiousBackgroundForm />} />
        <Route path="/family-details-form" element={<FamilyDetailsForm />} />
        <Route path="/education-career-form" element={<EducationCareerForm />} />
        <Route path="/location-form" element={<LocationForm />} />
        <Route path="/lifestyle-form" element={<LifestyleForm />} />
        <Route path="/partner-preference-form" element={<PartnerPreferenceForm />} />  

        // Auth Footer Routes
        <Route path="/blog" element={<><Header /><div className="pt-16"><BlogPage /></div></>} /> 
        <Route path="/VIP-lovenzea" element={<><Header /><div className="pt-16"><VipLovenZeaPage /></div></>} /> 
        <Route path="/success-stories" element={<><Header /><div className="pt-16"><SuccessStoriesPage /></div></>} />
        <Route path="/centres" element={<><Header /><div className="pt-16"><CentresPage /></div></>} />
        <Route path="/contact-us" element={<><Header /><div className="pt-16"><ContactPage /></div></>} />
        <Route path="/live" element={<><Header /><div className="pt-16"><LivePage /></div></>} />
        <Route path="/work-with-us" element={<><Header /><div className="pt-16"><WorkWithUsPage /></div></>} />

        <Route path="/my-tickets" element={<MyShadiLayout><MyTickets /></MyShadiLayout>} />

        {/* DASHBOARD */}
        <Route
          path="/my-shadi"
          element={
            <ProtectedRoute>
              <MyShadiLayout>                
                <Dashboard />         
            </MyShadiLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-shadi/chats"
          element={
            <ProtectedRoute>
              <MyShadiLayout>                
                <ChatsPage />         
            </MyShadiLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <MyShadiLayout>                
                <InterestsPage />         
            </MyShadiLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <MyShadiLayout>                
                <ChatListPage />         
            </MyShadiLayout>
            </ProtectedRoute>
          }
        />
        {/* Payment */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <MyShadiLayout>
                <Payment />
              </MyShadiLayout>
            </ProtectedRoute>
          }
        />

        {/* Premium Pages */}
        <Route path="/wedding" element={<><Header /><Wedding /></>} />
        <Route path="/special-services" element={<><Header /><SpecialServices /></>} />
        {/* MY PROFILE */}
        <Route
          path="/my-shadi/my-profile"
          element={
            <ProtectedRoute>
              <MyShadiLayout>
                <MyProfile />
              </MyShadiLayout>
            </ProtectedRoute>
          }
        />

        {/* EDIT PROFILE */}
        <Route
          path="/my-shadi/edit-profile"
          element={
            <ProtectedRoute>
              <MyShadiLayout>
                <MyProfile editModePage={true} />
              </MyShadiLayout>
            </ProtectedRoute>
          }
        />

        {/* MY PHOTOS */}
        <Route
          path="/my-shadi/my-photos"
          element={
            <ProtectedRoute>
              <MyShadiLayout>
                <MyPhoto />
              </MyShadiLayout>  
            </ProtectedRoute>
          }
        />

        {/* PARTNER PREFERENCES */}
        <Route
          path="/my-shadi/partner-preferences"
          element={
            <ProtectedRoute>
              <MyShadiLayout>
                  <PartnerPreference />
              </MyShadiLayout>
            </ProtectedRoute>
          }
        />
        {/* <Route path="/preferences/age-range" element={< />} /> */}
        <Route
          path="/my-shadi/partner-preferences/age-range"
          element={
            <MyShadiLayout>
              <AgeRangePage />
            </MyShadiLayout>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/country"
          element={
            <MyShadiLayout>
              <Country />
            </MyShadiLayout>
          }
        />
        {/* my order */}
        <Route
          path="/my-shadi/my-order"
          element={
            <MyShadiLayout>
              <MyOrder />
            </MyShadiLayout>
          }
        />
        <Route
          path="/my-shadi/refer"
          element={
            <MyShadiLayout>
              <ReferPage />
            </MyShadiLayout>
          }
        />
        <Route
          path="/my-shadi/saved-profiles"
          element={
            <ProtectedRoute>
              <SavedProfilesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-shadi/help"
          element={
            <MyShadiLayout>
              <HelpPage />
            </MyShadiLayout>
          }
        />
        <Route path="/help" element={<MyShadiLayout><HelpPage /></MyShadiLayout>} />
        <Route path="/support" element={<MyShadiLayout><HelpPage /></MyShadiLayout>} />

        <Route
          path="/my-shadi/security"
          element={
            <MyShadiLayout>
              <SecurityPage />
            </MyShadiLayout>
          }
        />

        <Route
          path="/my-shadi/online"
          element={
            <MyShadiLayout>
              <OnlineMembers />
            </MyShadiLayout>
          }
        />


        <Route
          path="/my-shadi/partner-preferences/height-range"
          element={
            <MyShadiLayout>
              <HeightRangePage />
            </MyShadiLayout>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/maritalstatus"
          element={
            <MyShadiLayout>
              <MaritalStatusPage />
            </MyShadiLayout>
          }
        />
        <Route
          path="/my-shadi/partner-preferences/religion"
          element={
            <MyShadiLayout>
              <ReligionPage />
            </MyShadiLayout>
          }
        />
        <Route
          path="/my-shadi/partner-preferences/community"
          element={
            <MyShadiLayout>
              <Community />
            </MyShadiLayout>
          }
        />

        {/* <Route path="/contact-filters" element={<ContactFilters />} /> */}


        <Route
          path="/my-shadi/partner-preferences/mothertongue"
          element={
            <MyShadiLayout>
              <MotherTonguePage />
            </MyShadiLayout>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/profession"
          element={
            <MyShadiLayout>
              <ProfessionPage />
            </MyShadiLayout>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/qualification"
          element={
            <MyShadiLayout>
              <QualificationPage />
            </MyShadiLayout>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/state"
          element={
            <MyShadiLayout>
              <StateLivingPage />
            </MyShadiLayout>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/city"
          element={
            <MyShadiLayout>
              <CityDistrictPage />
            </MyShadiLayout>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/annulincome"
          element={
            <MyShadiLayout>
              <AnnualIncomePage />
            </MyShadiLayout>
          }
        />
        {/* <Route
          path="/working-with-us"
          element={
            <>
              <Header />
              <SecondNav />
              <WorkingWithPage />
            </>
          }
        /> */}

        <Route
          path="/my-shadi/partner-preferences/diet"
          element={
            <MyShadiLayout>
              <DietPage />
            </MyShadiLayout>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/profile"
          element={
            <MyShadiLayout>
              <ProfileManagedByPage />
            </MyShadiLayout>
          }
        />

        <Route
          path="/my-shadi/settings"
          element={
            <ProtectedRoute>
              <MyShadiLayout>
                <Settings />
              </MyShadiLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-shadi/more"
          element={
            <MyShadiLayout>
              <MoreDropdown />
            </MyShadiLayout>
          }
        />





        <Route
          path="/inbox/pending/intrest"
          element={
            <>
              <MyShadiLayout>
              <Received />
              </MyShadiLayout>
            </>
          }
        />

        <Route
          path="/inbox/accepted/intrest"
          element={
            <>
              <MyShadiLayout>
               <Accepted />
              </MyShadiLayout>
            </>
          }
        />

        <Route
          path="/inbox/pending/requests"
          element={
            <>
              <MyShadiLayout>
              <Requests />
              </MyShadiLayout>
              
            </>
          }
        />

        <Route
          path="/inbox/sent/request"
          element={
            <>
              <MyShadiLayout>
              <Sent />
              </MyShadiLayout>
              
            </>
          }
        />

        <Route
          path="/inbox/contacts"
          element={
            <>
              <MyShadiLayout>
              <Contacts />
              </MyShadiLayout>
              
            </>
          }
        />




        <Route
          path="/inbox/archieved/intrest"
          element={
            <>
              <MyShadiLayout>
              <Deleted />
              </MyShadiLayout>
              
            </>
          }
        />

        <Route
          path="/my-shadi/my-contact/contact-filters"
          element={
            <MyShadiLayout>
              <ContactFilters />
            </MyShadiLayout>
          }
        />

        {/* Catch-all route for unknown URLs */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/my-shadi" : "/"} replace />} 
        />

             </Routes>

      {!isAdminPage && (isAuthenticated ? <AuthenticatedFooter /> : <Footer />)}
      <Toaster position="top-center" containerStyle={{ zIndex: 9999999 }} toastOptions={{ style: { marginTop: '80px' } }} />

      {/* Global Chat Window — opens from anywhere via Redux openChatWith() */}
      {activeChatUser && (
        <ChatWindow
          targetUser={activeChatUser}
          onClose={() => dispatch(closeChatWindow())}
        />
      )}
    </div >
  );
}

export default App;
