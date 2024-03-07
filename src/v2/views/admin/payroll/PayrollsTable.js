import React, { useState, useCallback, useEffect, Fragment } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Text from '../../../components/customText/Text';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { btnTxtBlack } from "../../../theme";
import { TooltipIndicator } from '../../../theme';

function Row(props) {
    const { row } = props;
    console.log(props, 'props')
    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset', background: props.status === "unfinalize" ? '#F6F6F6' : 'white' } }}>
                {row.main_row_data && row.main_row_data.map((data, index, array) => {
                    // const isStickyColumn = index < 3;

                    if (row.placement_information > 1 && ["Client Name", "Visa", "Hours", "OT Hours", "OT Rate", "Bill Rate", "Pay Rate", "Amount"].includes(data.column)) {
                        let content = [];
                        for (let i = 0; i < row.placement_information; i++) {
                            if (i === 0) { // First data
                                content.push(
                                    <div key={i} style={{ paddingBottom: '15px', marginLeft: index === 3 ? '' : '12px' }}>{data.value[i]}</div>,
                                    <Divider width="100%" />
                                );
                            } else if (i === row.placement_information - 1) { // Last data
                                content.push(
                                    <div key={i} style={{ paddingTop: '15px', marginLeft: index === 3 ? '' : '12px' }}>{data.value[i]}</div>
                                );
                            } else { // Middle data
                                content.push(
                                    <div key={i} style={{ paddingTop: '15px', marginLeft: index === 3 ? '' : '12px', paddingBottom: '15px' }}>{data.value[i]}</div>,
                                    <Divider width="100%" />
                                );
                            }
                        }
                        return (
                            <TableCell style={{
                                padding: 0, paddingTop: '20px', paddingBottom: '20px',
                                // position: isStickyColumn?'sticky': 'unset',
                                // zIndex: isStickyColumn ?'1100 !important': 'unset',
                                // left: (index == 0) ? 0 : (index == 1 && isScrollingRight) ? '74px' : (index == 2 && isScrollingRight)?'324px':0,
                                // background: isStickyColumn ?'white':'none !important',
                            }} >
                                {content}
                            </TableCell>
                        );
                    } else {
                        if (row.placement_information == 1 && ["Client Name", "Visa", "Hours", "OT Hours", "OT Rate", "Bill Rate", "Pay Rate", "Amount"].includes(data.column)) {
                            return <TableCell
                                sx={{
                                    // position: isStickyColumn?'sticky': 'unset',
                                    // zIndex: isStickyColumn ?'1100 !important': 'unset',
                                    // left: (index == 0) ? 0 : (index == 1 && isScrollingRight) ? '74px' : (index == 2 && isScrollingRight)?'324px':0,
                                    // backgroundColor: isStickyColumn ?'white !important':'none !important',
                                }}>{data.value[0]}</TableCell>;
                        } else {
                            return <TableCell
                                sx={{
                                    // position: isStickyColumn?'sticky': 'unset',
                                    // zIndex: isStickyColumn ?'1100 !important': 'unset',
                                    // left: (index == 0) ? 0 : (index == 1 && isScrollingRight) ? '74px' : (index == 2 && isScrollingRight)?'324px':0,
                                    // backgroundColor: isStickyColumn ?'white !important':'none !important',
                                }}>{data.value}</TableCell>;

                        }
                    }
                })}
            </TableRow>
        </Fragment>
    );
}



export default function PayrollsTable(props) {
    console.log(props, 'props undefinedundefinedundefinedundefined')
    const { rows, visaTypes, setVisaTypeIds, setVisaTypes, columns } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    // const [isScrolling, setIsScrolling] = useState(false);
    const [isScrollingRight, setIsScrollingRight] = useState(false);

    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = useCallback((e) => {
        const currentScrollPosition = e.target.scrollLeft;
        if (currentScrollPosition === 0) {
            setIsScrollingRight(false);
        } else if (currentScrollPosition > scrollPosition) {
            setIsScrollingRight(true);
        }
        setScrollPosition(currentScrollPosition);
    }, [scrollPosition]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll])

    const handleVisaFilter = (param) => {
        for (var i in visaTypes) {
            if (visaTypes[i].id == param) {
                visaTypes[i].status = !visaTypes[i].status;
                setVisaTypes([...visaTypes]);
            }
        }
        var filterIds = [];
        for (let k in visaTypes) {
            if (visaTypes[k].status) {
                filterIds.push(visaTypes[k].id);
            }
        }
        setVisaTypeIds(filterIds);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Fragment>
            <TableContainer onScroll={handleScroll} sx={{ marginBottom: '70px', maxHeight: '52vh', overflow: 'scroll' }}>
                <Table stickyHeader sx={{ width: 'max-content' }} aria-label="collapsible table">
                    <TableHead sx={{
                        '& .MuiTableCell-head:first-of-type': {
                            borderRadius: '12px 0px 0px 0px !important',
                            // position: 'sticky',
                            // left: 0,
                            // zIndex: '1100 !important',
                            // backgroundColor: '#F6F6F6 !important',
                        },
                        // '& .MuiTableCell-head:nth-of-type(2)': {
                        //     position: 'sticky',
                        //     left: isScrollingRight ? '74px' : 0,
                        //     zIndex: '1100 !important',
                        //     backgroundColor: '#F6F6F6 !important',
                        // },
                        // '& .MuiTableCell-head:nth-of-type(3)': {
                        //     position: 'sticky',
                        //     left: isScrollingRight ? '324px' : 0,
                        //     zIndex: '1100 !important',
                        //     backgroundColor: '#F6F6F6 !important',
                        // },
                        '& .MuiTableCell-head:last-of-type': {
                            borderTopRightRadius: '12px'
                        },
                        maxWidth: '650px',
                        borderBottom: "none !important",
                        backgroundColor: '#F6F6F6 !important',
                        color: `${btnTxtBlack.shade4} !important`,
                        font: "16px Nunito Sans, sans-serif !important",
                        fontWeight: "500 !important",
                        opacity: 1,
                        border: 0,
                        outline: 'none !important'
                    }}>
                        <TableRow>
                            {columns.map((head, key) => (
                                <TableCell
                                    key={key}
                                    sx={{
                                        color: '#171717',
                                        font: "16px 'Nunito Sans', sans-serif",
                                        fontWeight: '500 !important',
                                        backgroundColor: '#F6F6F6 !important',
                                        textAlign: ['Visa', 'Salary Amount'].includes(head.name) ? 'center' : '',
                                        ...(head.width !== '' && { width: head.width }),
                                    }}
                                >
                                    {head.name === 'Visa' ? (
                                        <TooltipIndicator sx={{ backgroundColor: "#0C75EB !important" }}
                                            title={<Text mediumWhite><b><u>Note :</u></b> Selecting any visaType will impact all payroll categories.</Text>}
                                            placement='right-start'>
                                            <Box display="flex" justifyContent={'center'} sx={{ mt: '6px' }}>
                                                <div className='VisaName' style={{ marginLeft: "20px" }}>{head.name}</div>
                                                <div>
                                                    {anchorEl ? (
                                                        <KeyboardArrowDownIcon name="VisaName" onClick={handleClose} sx={{ cursor: 'pointer', color: "#737373 !important" }} />
                                                    ) : (
                                                        <KeyboardArrowDownIcon name="VisaName" onClick={handleClick} sx={{ cursor: 'pointer', color: "#737373 !important" }} />
                                                    )}
                                                </div>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl)}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'center',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'left',
                                                    }}
                                                    onClose={handleClose}>
                                                    {visaTypes &&
                                                        visaTypes.map((item, index) => (
                                                            <div key={index}>
                                                                <MenuItem disableRipple={true}>
                                                                    <Box display={'flex'} width={'150px'}>
                                                                        <Checkbox
                                                                            sx={{
                                                                                width: '18px !important',
                                                                                height: '18px !important',
                                                                                borderRadius: '4px !important',
                                                                                border: '1px !important',
                                                                                padding: '0px !important',
                                                                            }}
                                                                            onChange={() => handleVisaFilter(item.id)}
                                                                            value={item.status}
                                                                            checked={item.status}
                                                                        />
                                                                        <Typography
                                                                            sx={{
                                                                                marginLeft: '15px !important',
                                                                                fontSize: '12px !important',
                                                                                fontFamily: 'Nunito, Nunito Sans, sans-serif !important',
                                                                                fontWeight: '500 !important',
                                                                                color: '#262626 !important',
                                                                            }}
                                                                        >
                                                                            {item.name}
                                                                        </Typography>
                                                                    </Box>
                                                                </MenuItem>
                                                                {index < visaTypes.length - 1 && <Divider />}
                                                            </div>
                                                        ))}

                                                </Menu>
                                            </Box>
                                        </TooltipIndicator>
                                    ) : (
                                        head.name
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ overflow: 'auto' }}>
                        {rows && rows.map((row, key) => (
                            <Row isScrollingRight={isScrollingRight} columns={columns} key={key} id={row.id} row={row} status={props.status} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>

    );
}