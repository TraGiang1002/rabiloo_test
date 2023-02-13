import {createTheme, Grid, ThemeProvider} from '@mui/material';
import {QueryClient, QueryClientProvider} from 'react-query';
import {BrowserRouter as Router, Outlet, Route, Routes} from 'react-router-dom';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import {AppHeader, AppModal, AppNotFound} from './components';
import {useAppAccount} from './hooks';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import SignUp from './pages/sign-up/SignUp';
import UsersDetail from './pages/users-detail/UsersDetail';
import Users from './pages/users/Users';
import {THEME} from './utils';
import {SnackbarProvider} from 'notistack';
// import PremierLeagueTable from "./pages/premier-league-table/PremierLeagueTable";
import Problems from './pages/Problems/Problems';
import Status from './pages/Status/Status';
import Ranking from './pages/Ranking/Ranking';
import UpdateTest from './pages/UpdateTest/UpdateTest';
import ContentTest from './pages/ContentTest/ContentTest';
import Question from './pages/question-list/Question';
import SubmissionHistory from './pages/submission-history/SubmissionHistory';
import UserInfo from './pages/user-info/UserInfo';
import UserTest from './pages/UserTest/UserTest';
import UpdatePasswordUser from './pages/update-password-user/UpdatePasswordUser';
import UserManagement from './pages/user-management/UserManagement';
import ResetPassword from './pages/reset-password/ResetPassword';
import SignUpEmail from './pages/sign-up-email/SignUpEmail';
import AdminHistoryTest from './pages/admin-history-test/AdminHistoryTest';
import AdminHistoryDetailTest from './pages/admin-history-detail-test/AdminHistoryDetailTest';
import ForgotPassword from './pages/forgot-password/ForgotPassword';

const theme = createTheme(THEME);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const {account} = useAppAccount();

  const renderRoutes = () => {
    if (account.accessToken) {
      if (account.roles && account.roles[0] === 'ROLE_ADMIN') {
        return (
          <Routes>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="/sign-up-email" element={<SignUpEmail />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <>
                  <AppHeader />
                  <Outlet />
                </>
              }>
              <Route path="" element={<Home />} />
              <Route path="problems" element={<Problems />} />
              <Route path="status" element={<Status />} />
              <Route path="ranking" element={<Ranking />} />
              <Route path="update-test" element={<UpdateTest />} />
              <Route path="content-test" element={<ContentTest />} />
              <Route path="user-test" element={<UserTest />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="admin-history-test" element={<AdminHistoryTest />} />

              <Route
                path="admin-history-detail-test"
                element={<AdminHistoryDetailTest />}
              />

              <Route path="*" element={<AppNotFound />} />
            </Route>
          </Routes>
        );
      }
      return (
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="/sign-up-email" element={<SignUpEmail />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <>
                <AppHeader />
                <Outlet />
              </>
            }>
            <Route path="" element={<Home />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UsersDetail />} />
            <Route path="users/:id/friend-list*" element={<UsersDetail />} />
            {/* <Route path='premier-league-table' element={<PremierLeagueTable />} /> */}
            <Route path="status" element={<Status />} />
            <Route path="change-password" element={<UpdatePasswordUser />} />

            <Route path="question" element={<Question />} />
            <Route path="problems" element={<Problems />} />

            <Route path="*" element={<AppNotFound />} />
            <Route path="submission-history" element={<SubmissionHistory />} />
            <Route path="user-info" element={<UserInfo />} />
            <Route path="user-test" element={<UserTest />} />

            {/* <Route path="show-answer" element={<ShowAnswer />} /> */}
            <Route path="*" element={<AppNotFound />} />
          </Route>
        </Routes>
      );
    } else {
      return (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AppHeader />
                <Problems />
                <Outlet />
              </>
            }></Route>
          <Route path="" element={<Problems />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up-email" element={<SignUpEmail />} />

          <Route
            path="user-test"
            element={
              <>
                <AppHeader />
                <UserTest />
                <Outlet />
              </>
            }
          />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route path="*" element={<Login />} />

          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <SnackbarProvider
            maxSnack={10}
            autoHideDuration={1500}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}>
            <Grid>
              <Router>{renderRoutes()}</Router>
              <AppModal />
            </Grid>
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
