import * as React from 'react';
import PropTypes from 'prop-types';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {visuallyHidden} from '@mui/utils';
import {AppModalService} from '../../components/AppModal';
import {useAppLanguage} from '../../hooks';
import {useQuery} from 'react-query';
import {FetchApi} from '../../utils';
import moment from 'moment';
import {AppLoadingView} from '../../components';
import {useSnackbar} from 'notistack';

function createData(Name, Id, rightAnswer, Date, Score) {
  return {
    Name,
    Id,
    rightAnswer,
    Date,
    Score,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const headCells = [
  {
    id: 'Id',
    numeric: true,
    disablePadding: false,
    label: 'ID',
  },
  {
    id: 'UserName',
    numeric: true,
    disablePadding: false,
    label: 'Username',
  },
  {
    id: 'FirstName',
    numeric: false,
    disablePadding: true,
    label: 'H???',
  },
  {
    id: 'LastName',
    numeric: false,
    disablePadding: true,
    label: 'T??n',
  },
  {
    id: 'Birthday',
    numeric: false,
    disablePadding: true,
    label: 'Sinh nh???t',
  },
  {
    id: 'Gender',
    numeric: false,
    disablePadding: false,
    label: 'Gi???i t??nh',
  },
  {
    id: 'City',
    numeric: true,
    disablePadding: false,
    label: 'Th??nh ph???',
  },
  {
    id: 'Delete',
    numeric: true,
    disablePadding: false,
    label: '',
  },
];

function EnhancedTableHead(props) {
  const {
    // onSelectAllClick,
    order,
    orderBy,
    // numSelected,
    // rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell> */}
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'justify' : 'justify'}
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = props => {
  const {numSelected} = props;

  return (
    <Toolbar
      sx={{
        pl: {sm: 2},
        pr: {xs: 1, sm: 1},
        ...(numSelected > 0 && {
          bgcolor: theme =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}>
      {/* {numSelected > 0 ? (
        <Typography
          sx={{flex: '1 1 100%'}}
          color="inherit"
          variant="subtitle1"
          component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{flex: '1 1 100%'}}
          variant="h6"
          id="tableTitle"
          component="div">
          Chi ti???t b??i thi
        </Typography>
      )} */}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
const gender = {
  male: 'Nam',
  female: 'N???',
  other: 'Kh??c',
};

export default function UserManagement() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(false);
  const {enqueueSnackbar} = useSnackbar();

  const {data, isLoading, refetch} = useQuery(
    `userAll-${page}-${rowsPerPage}`,
    () =>
      FetchApi.getAllUsers({
        page: page + 1,
        size: rowsPerPage,
      }),
  );
  const {data: dataUser, isLoading: isLoadingUserInfo} = useQuery(
    'userInfo',
    () => FetchApi.getUserInfo(),
  );
  const dataUserInfo = dataUser?.dto || {};

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, Name) => {
    const selectedIndex = selected.indexOf(Name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, Name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = data?.dtos?.map(n => n.Name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangeDense = event => {
    setDense(event.target.checked);
  };

  const isSelected = Name => selected.indexOf(Name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.dtos?.length) : 0;

  if (isLoading || isLoadingUserInfo) {
    return <AppLoadingView />;
  }
  return (
    <Box sx={{width: '100%'}}>
      <Paper sx={{width: '100%', mb: 2}}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{minWidth: 750}}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data?.dtos?.length || rowsPerPage}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(data?.dtos || [], getComparator(order, orderBy)).map(
                (row, index) => {
                  const isItemSelected = isSelected(row.Name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      // hover
                      // onClick={event => handleClick(event, row.Name)}
                      // role="checkbox"
                      // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}>
                      <TableCell align="justify">{row.id}</TableCell>
                      <TableCell align="justify">{row.userName}</TableCell>
                      <TableCell align="justify">{row.firstName}</TableCell>
                      <TableCell align="justify">{row.lastName}</TableCell>
                      <TableCell align="justify">
                        {moment(row.birthDay).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell align="justify">
                        {gender[row.gender || 'other']}
                      </TableCell>
                      <TableCell align="justify">{row.city}</TableCell>
                      <TableCell padding="checkbox">
                        <DeleteIcon
                          color="error"
                          onClick={async () => {
                            if (loading) {
                              return;
                            }
                            setLoading(true);
                            const result = await FetchApi.deactiveUser({
                              id: row.id,
                            });
                            setLoading(false);
                            if (result?.statusCode === 'OK') {
                              enqueueSnackbar('Xo?? user th??nh c??ng', {
                                variant: 'success',
                              });
                              refetch();
                              return;
                            }
                            enqueueSnackbar(`${result?.message}`, {
                              variant: 'error',
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
              {/* {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          label="S??? h??ng tr??n trang"
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Hi???n th??? c?? ?????ng"
      /> */}
    </Box>
  );
}
