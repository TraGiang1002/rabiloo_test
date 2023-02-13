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
import {useSearchParams} from 'react-router-dom';

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
  if (orderBy === 'id') {
    if (b.examResult[orderBy] < a.examResult[orderBy]) {
      return -1;
    }
    if (b.examResult[orderBy] > a.examResult[orderBy]) {
      return 1;
    }
    return 0;
  }
  if (orderBy === 'name') {
    if (b.user.firstName < a.user.firstName) {
      return -1;
    }
    if (b.user.firstName > a.user.firstName) {
      return 1;
    }
    return 0;
  }
  if (orderBy === 'gender') {
    if (b.user.gender < a.user.gender) {
      return -1;
    }
    if (b.user.gender > a.user.gender) {
      return 1;
    }
    return 0;
  }
  if (orderBy === 'birthday') {
    if (b.user.birthDay < a.user.birthDay) {
      return -1;
    }
    if (b.user.birthDay > a.user.birthDay) {
      return 1;
    }
    return 0;
  }
  if (orderBy === 'rightAnswer' || orderBy === 'score') {
    if (b.examResult.points < a.examResult.points) {
      return -1;
    }
    if (b.examResult.points > a.examResult.points) {
      return 1;
    }
    return 0;
  }
  if (orderBy === 'start') {
    if (b.examResult.start < a.examResult.start) {
      return -1;
    }
    if (b.examResult.start > a.examResult.start) {
      return 1;
    }
    return 0;
  }
  if (orderBy === 'username') {
    if (b.user.username < a.user.username) {
      return -1;
    }
    if (b.user.username > a.user.username) {
      return 1;
    }
    return 0;
  }
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
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Người làm',
  },
  {
    id: 'gender',
    numeric: false,
    disablePadding: true,
    label: 'Giới tính',
  },
  {
    id: 'birthday',
    numeric: false,
    disablePadding: false,
    label: 'Ngày sinh',
  },
  {
    id: 'rightAnswer',
    numeric: true,
    disablePadding: false,
    label: 'Số câu đúng',
  },
  {
    id: 'start',
    numeric: true,
    disablePadding: false,
    label: 'Ngày làm bài ',
  },
  {
    id: 'score',
    numeric: true,
    disablePadding: false,
    label: 'Điểm ',
  },
  {
    id: 'username',
    numeric: true,
    disablePadding: false,
    label: 'Username',
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
          Chi tiết bài thi
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
  female: 'Nữ',
  other: 'Khác',
};

export default function AdminHistoryDetailTest() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchParams] = useSearchParams();
  const idTest = searchParams.get('idTest');
  const {data, isLoading} = useQuery(
    `adminDetailHistoryExam-${page}-${rowsPerPage}-${idTest}`,
    () =>
      FetchApi.adminGetDetailTestHistory({
        page: page + 1,
        size: rowsPerPage,
        examId: idTest,
      }),
  );

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

  if (isLoading) {
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
              rowCount={data?.dtos?.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(data?.dtos || [], getComparator(order, orderBy)).map(
                (row, index) => {
                  const isItemSelected = isSelected(row.Name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  let nameUser = 'Chưa xác định';
                  if (!!row?.user?.firstName && row?.user?.lastName) {
                    nameUser = row?.user?.firstName + ' ' + row?.user?.lastName;
                  }
                  return (
                    <TableRow
                      // hover
                      // onClick={event => handleClick(event, row.Name)}
                      // role="checkbox"
                      // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.examResult?.id}
                      selected={isItemSelected}>
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell> */}
                      {/* <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none">
                        {row.Name}
                      </TableCell> */}
                      <TableCell align="justify">
                        {row?.examResult?.id}
                      </TableCell>
                      <TableCell align="justify">{nameUser}</TableCell>
                      <TableCell align="justify">
                        {gender[row?.user?.gender || 'other']}
                      </TableCell>
                      <TableCell align="justify">
                        {moment(row?.user?.birthDay).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell align="justify">
                        {(row?.examResult?.points || 0) / 10}
                      </TableCell>
                      <TableCell align="justify">
                        {moment(row?.examResult?.start).format(
                          'DD/MM/YYYY HH:mm',
                        )}
                      </TableCell>
                      <TableCell align="justify">
                        {row?.examResult?.points}
                      </TableCell>
                      <TableCell align="justify">
                        {row?.user?.userName}
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
          label="Số hàng trên trang"
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Hiển thị cô đọng"
      /> */}
    </Box>
  );
}
