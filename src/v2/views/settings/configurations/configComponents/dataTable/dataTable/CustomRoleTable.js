import React from 'react';
import { Checkbox, TableContainer, } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CustomRoleTableStyles from './CustomRoleTableStyles';
import NestedMenu from './NestedMenu';
import { ReactComponent as CheckedIcon } from '../../../../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../../../../assets/svg/CheckedBorderIcon.svg';
import Text from '../../../../../../components/customText/Text';

const columns = [
  {
    name: 'Module',
    width: '17%',
  },
  {
    name: 'Full Access',
    width: '14%',
  },
  {
    name: 'Create',
    width: '14%',
  },
  {
    name: 'Edit',
    width: '14%',
  },
  {
    name: 'View',
    width: '14%',
  },
  {
    name: 'Delete',
    width: '14%',
  },
  {
    name: 'More',
    width: '10%',
  },
  {
    name: '',
    width: '10%',
  },
];
const column1 = [
  {
    name: 'Create',
    width: '14%',
  },
  {
    name: 'Edit',
    width: '14%',
  },
  {
    name: 'View',
    width: '14%',
  },
  {
    name: 'Delete',
    width: '14%',
  },
];

const CustomRowTable = ({ rolesIndex, isEditable }) => {// eslint-disable-next-line
  const [checked, setChecked] = React.useState([]);
  const [enableDisableRow, setEnableDisableRow] = React.useState([]);
  const [activateDeactivateRow, setActivateDeactivateRow] = React.useState([]);


  console.log(rolesIndex);
  var keys = [];
  if (!rolesIndex || Object.keys(rolesIndex).length <= 2) {
    console.log("nullllllllllllllllllllll");
  } else {
    keys = Object.keys(rolesIndex['permissions']);
  }
  const classes = CustomRoleTableStyles();

 
  return (
    <React.Fragment>
      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader >
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell sx={{ width: column.width, }} key={column.name}><Text headerBlack >{column.name}</Text></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody >
            {keys.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell><Text mediumBlack14>{row}</Text></TableCell>
                  <TableCell>
                    <Checkbox
                      // disabled={activateDeactivateRow.includes(row)}
                      // name={`${index}_create`}
                      // checked={cellData.is_allowed}
                      // onChange={handleChange}
                      icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />}
                      disabled={isEditable}
                    />
                  </TableCell>
                  {
                    column1.map((column, colIndex) => (
                      <TableCell>
                        <Checkbox
                          // disabled={activateDeactivateRow.includes(row)}
                          // name={`${index}_create`}
                          name='checkbox'
                          checked={rolesIndex['permissions'][row]
                            .some(permission => permission.permission_name === column.name && permission.is_allowed)}
                          // onChange={handleChange}
                          icon={<CheckBorderIcon />} checkedIcon={<CheckedIcon />}
                          disabled={isEditable}
                        />
                      </TableCell>
                    ))
                  }
                  {// eslint-disable-next-line
                    rolesIndex['permissions'][row].map(additional => {
                      if (additional.additional_permissions == undefined) {
                        (console.log(additional.additional_permissions, "|||||||||||||||||||||||||||||||"))
                        return ("");
                      }
                    })
                  }
                  <TableCell>
                    {

                      rolesIndex['permissions'][row].map(additional => {
                        if (additional.additional_permissions == undefined) {
                          (console.log(additional.additional_permissions, "|||||||||||||||||||||||||||||||"))
                          return ("");
                        } else {
                          return (
                            (additional.additional_permissions.length > 0)
                              ?
                              <NestedMenu
                                rowId={row.module}
                                enableDisableRow={enableDisableRow}
                                activateDeactivateRow={activateDeactivateRow}
                                setEnableDisableRow={setEnableDisableRow}
                                setActivateDeactivateRow={setActivateDeactivateRow}
                                children={
                                  additional.additional_permissions.map((addparams, index) => (
                                    { label: addparams.permission_name, key: index }))
                                }
                                disabled
                              /> : "")
                        }
                      })
                    }
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Stack justifyContent="flex-end" direction="row" gap={'20px'} mt={'30px'}>
        <Button
          cancelOutline
          sx={{
            width: "103px !important",
            height: "42px !important",
          }}
          onClick={() => {
            setActivateDeactivateRow([]);
            setEnableDisableRow([]);
          }}
        >
          <Typography sx={{ font: "18px Nunito", fontWeight: "500" }}>Cancel</Typography>
        </Button>
        <Button saveBtn sx={{
          width: "88px !important",
          height: "42px !important"
        }}>Save</Button>
      </Stack> */}
    </React.Fragment>
  );
};

export default CustomRowTable;