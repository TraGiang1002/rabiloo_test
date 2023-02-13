import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';
import {
  ButtonGroup,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';

import {useAppAccount, useAppLanguage, useOnKeyPress} from '../hooks';
import {AppModalService} from './AppModal';
import Cookies from 'universal-cookie';
// modal logout
const LogoutModal = ({onClick}) => {
  // useOnKeyPress('Enter', onClick);
  return <div style={{textAlign: 'center'}}>Đăng xuất ?</div>;
};

const AppHeader = () => {
  const {Strings, setLanguage, language} = useAppLanguage();
  const {account, setAccount} = useAppAccount();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const cookies = new Cookies();

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const onHandleLogout = () => {
    handleCloseUserMenu();
    setAccount({});
    cookies.set('account', {});
    navigate('/login');
    AppModalService.close();
  };
  const onLogout = () => {
    AppModalService.set({
      children: <LogoutModal onClick={onHandleLogout} />,
      onConfirm: onHandleLogout,
      wrapperStyle: {width: 220},
    });
  };

  let pages = [
    {label: Strings.exam, path: '/problems'},
    {label: 'Thông tin người dùng', path: '/user-info'},
    {label: Strings.pl_table, path: '/submission-history'},
    {label: Strings.status, path: '/status'},
    {label: 'Thay đổi mật khẩu', path: '/change-password'},
  ];
  if (account.roles && account.roles[0] === 'ROLE_ADMIN') {
    pages = [
      {label: Strings.problem, path: '/problems'},
      {label: Strings.status, path: '/status'},
      {label: 'Quản lý người dùng', path: '/user-management'},
      {label: 'Lịch sử làm bài', path: '/admin-history-test'},
    ];
  }

  let settings = [
    {
      label: Strings.logout,
      onClick: onLogout,
    },
  ];
  console.log('account', account);
  if (!account.roles) {
    pages = [];
    settings = [
      {
        label: 'Đăng nhập',
        onClick: () => navigate('/login'),
      },
    ];
  }
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              cursor: 'pointer',
              display: {xs: 'none', md: 'flex'},
            }}
            onClick={() => {
              if (account.accessToken) {
                navigate('');
                return;
              }
              navigate('/');
            }}>
            {Strings.app_name}
          </Typography>

          <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              keepMounted
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{display: {xs: 'block', md: 'none'}}}>
              <MenuItem
                key={'home'}
                onClick={() => {
                  handleCloseNavMenu();
                  navigate('');
                }}>
                <Typography textAlign="center">{Strings.home}</Typography>
              </MenuItem>
              {pages.map(page => (
                <MenuItem
                  key={page.path}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(page.path);
                  }}>
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
              <MenuItem
                key={'logout'}
                onClick={() => {
                  handleCloseNavMenu();
                  onLogout();
                }}>
                <Typography textAlign="center">{Strings.logout}</Typography>
              </MenuItem>
            </Menu>
          </Box>
          {/* <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer", display: { xs: "flex", md: "none" } }}
            onClick={() => navigate("")}>
            {Strings.app_name}
          </Typography> */}
          <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {pages.map(page => (
              <Button
                key={page.path}
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(page.path);
                }}
                sx={{my: 2, color: 'white', display: 'block'}}>
                {page.label}
              </Button>
            ))}
          </Box>

          <Box sx={{flexGrow: 0}}>
            {/* <ButtonGroup sx={{mr: 2}} variant="contained" size="small">
              <Button
                color={language === 'EN' ? 'secondary' : 'disabled'}
                onClick={() => setLanguage('EN')}>
                {Strings.english}
              </Button>
              <Button
                color={language === 'VI' ? 'secondary' : 'disabled'}
                onClick={() => setLanguage('VI')}>
                {Strings.vietnamese}
              </Button>
            </ButtonGroup> */}
            <Tooltip title="Tùy chọn">
              <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                <Avatar
                  alt="Remy Sharp"
                  src="https://lh3.googleusercontent.com/ogw/AOh-ky07PA4FtYVoXzSeqvC9CHnTwDxdXqlxmcio5pcbnQ=s32-c-mo"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{mt: 1}}
              anchorEl={anchorElUser}
              keepMounted
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              {settings.map(setting => (
                <MenuItem key={setting.label} onClick={setting.onClick}>
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export {AppHeader};
