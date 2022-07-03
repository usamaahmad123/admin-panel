import PropTypes from 'prop-types';
// material
import { visuallyHidden } from '@material-ui/utils';
import { Box, TableRow, TableCell, TableHead, TableSortLabel } from '@material-ui/core';

// ----------------------------------------------------------------------

UserListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  onRequestSort: PropTypes.func
};

export default function UserListHead({ order, orderBy, headLabel, onRequestSort }) {
  const createSortHandler = (event) => {
    onRequestSort(event);
  };

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'center'}
            sortDirection={headCell.id === 'createdAt' ? order : false}
          >
            <TableSortLabel
              hideSortIcon={headCell.id !== 'createdAt'}
              active={headCell.id === 'createdAt'}
              direction={headCell.id === 'createdAt' ? order : 'asc'}
              onClick={() => (headCell.id === 'createdAt' ? createSortHandler(headCell.id) : '')}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
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
