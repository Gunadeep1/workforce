import React, { useState, useEffect, useCallback, Fragment } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import { useNavigate } from 'react-router-dom';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { btnTxtBlack } from "../../theme";
import { Stack } from '@mui/system';

function Row(props) {
    const { url, name, acc, row, openAccordion, setOpenAccordion, toggleAccordion, getApprovedByApicall } = props;
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setOpen(openAccordion === row.id);
    }, [openAccordion, row.id]);

    const handleAccordionToggle = useCallback(() => {
        if (!open) {
            if (name == "Invoice Ready Timesheet") {
                getApprovedByApicall(row.id);
            }
        }
        if (toggleAccordion) {
            setOpenAccordion((prevOpen) => (prevOpen === row.id ? null : row.id));
        } else {
            setOpen(!open);
        }
        // eslint-disable-next-line  
    }, [row.id, setOpenAccordion, toggleAccordion, open]);

    const rowHandler = (index) => {
        if (url && index !== 6) {
            console.log(row, "row@@##$$%%");
            navigate("/timesheet/add-timesheet", { state: { id: row.id, name: name, isInvoiceConfigured: row.isInvoiceConfigured } })
        }
    }

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                {row.main_row_data && row.main_row_data.map((data, index) => (
                    <TableCell
                        sx={{
                            border: open ? 'none' : '',
                            borderBottom: open ? 'none' : '1px solid #EAECF0 !important',
                            textAlign: index === row.main_row_data.length - 1 ? 'center' : '',
                            cursor: (url && index !== 6) ? "pointer" : "default",
                        }}
                        onClick={() => rowHandler(index)}
                        key={index}
                    >
                        {data}
                    </TableCell>
                ))}
                <TableCell sx={{ border: open ? 'none' : '' }}>
                    {acc && (
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={handleAccordionToggle}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    )}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{
                        border: open ? 'none' : '',
                        paddingBottom: 0,
                        paddingTop: 0,
                    }}
                    colSpan={row.main_row_data.length + 1}
                >
                    <Collapse in={open} timeout="auto">
                        <Box sx={{ border: 'none', paddingBottom: '10px' }}>
                            {row.sub_row_content && row.sub_row_content.map((data, index) => (
                                <Fragment key={index}>
                                    {data}

                                    {/* {
                                        name == "Invoice Ready Timesheet" ? ""

                                            : data
                                    } */}

                                </Fragment>
                            ))}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

export default function TableAccordion(props) {
    const { url, name, acc, rows, columns, toggleAccordion, getApprovedByApicall } = props;
    const [openAccordion, setOpenAccordion] = useState(null);
    // Add the default column at the end of the columns array
    const modifiedColumns = [
        ...columns,
        { 'name': '', 'icon': '', 'width': 0 }
    ];

    return (
        <Fragment>
            <Table aria-label="collapsible table" >
                <TableHead sx={{
                    '& .MuiTableCell-head:first-of-type': {
                        borderRadius: '12px 0px 0px 0px !important',
                    },
                    '& .MuiTableCell-head:last-of-type': {
                        borderTopRightRadius: '12px',
                    },
                    position: 'sticky !important',
                    top: 0,
                    zIndex: 1,
                    borderBottom: "none !important",
                    backgroundColor: '#F6F6F6 !important', color: `${btnTxtBlack.shade4} !important`, font: "16px Nunito Sans, sans-serif !important", fontWeight: "500 !important", opacity: 1, border: 0, outline: 'none !important'
                }}>
                    <TableRow>
                        {modifiedColumns.map((head, key) => (
                            <TableCell
                                key={key}
                                sx={{
                                    color: '#171717',
                                    font: "16px 'Nunito Sans', sans-serif",
                                    fontWeight: 500,
                                    textAlign: key === 0 ? '' : 'center',
                                    ...(head.width !== '' && { width: head.width }),
                                }}
                            >
                                <Stack direction={"row"} justifyContent={key == 0 ? "" : "center"}>
                                    {head.name}
                                    {head.icon}
                                </Stack>

                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length === 0 ? (<TableRow>
                        <TableCell colSpan={modifiedColumns.length} align="center" display='flex' height={"345vh"} flexDirection="column">
                            <span>No Data Available</span>
                        </TableCell>
                    </TableRow>) :
                        (rows.map((row, key) => (<Row url={url} name={name} acc={acc} openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} toggleAccordion={toggleAccordion} getApprovedByApicall={getApprovedByApicall}
                            key={key} row={row}/>))
                        )}
                </TableBody>
            </Table>
        </Fragment>
    );
}