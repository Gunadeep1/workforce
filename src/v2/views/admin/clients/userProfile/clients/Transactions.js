import React, { useState, useEffect } from 'react';
import UserProfileStyles from '../UserProfileStyles';
import Text from '../../../../../components/customText/Text';
import { Box, Tabs, Tab, Skeleton, Typography } from '@mui/material';
import Table from '../../../../../components/table/Table';
import ClientsAPI from '../../../../../apis/admin/clients/ClientsApi';
import { useLocation } from 'react-router-dom';

const transactionsTab = ["Invoice", "Payments", "Consultants"];
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Transactions() {

    const classes = UserProfileStyles();
    const location = useLocation();
    const [tab, setTab] = useState(0);
    const [pagination, setPagination] = useState(
        {
            total: "",
            currentPage: 1,
            perPage: 4,
            totalPages: ""
        }
    );
    const [invoiceRows, setInvoiceRows] = useState([]);
    const [paymentRows, setPaymentRows] = useState([]);
    const [consultantRows, setConsultantRows] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (tab == 0) {
            getInvoiceList(pagination);
        }
        if (tab == 1) {
            getPaymentList(pagination);
        }

        if (tab == 2) {
            getConsultantList(pagination);
        }

        // eslint-disable-next-line
    }, [tab]);




    const getInvoiceList = (paginationData) => {
        setLoading(true);
        ClientsAPI.getTransactionInvoiceList(location.state.data.id, paginationData.currentPage, paginationData.perPage).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setLoading(false);
                    setInvoiceRows(res.data.data);
                }
                setPagination({ ...pagination })
            }, 200)
        })
    }

    const getPaymentList = (paginationData) => {
        setLoading(true);
        ClientsAPI.getTransactionPaymentList(location.state.data.id, paginationData.currentPage, paginationData.perPage).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setLoading(false);
                    setPaymentRows(res.data.data);
                }
            }, 200)
        })
    }

    const getConsultantList = (paginationData) => {
        setLoading(true);
        ClientsAPI.getTransactionConsultantList(location.state.data.id, paginationData.currentPage, paginationData.perPage).then((res) => {
            setTimeout(() => {
                if (res.data.statusCode === 1003) {
                    setLoading(false);
                    setConsultantRows(res.data.data);
                }
            }, 200)
        })
    }

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };


    const invoiceColumns = [
        {
            field: "invoice_id",
            align: "center",
            headerAlign: "center",
            headerName: "Invoice No",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : params.row.invoice_id ? params.row.invoice_id : "--",

        },
        {
            field: "due_date",
            align: "center",
            headerAlign: "center",
            headerName: "Due Date", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : params.row.due_date ? params.row.due_date : "--",
        },
        {
            field: "amount",
            align: "center",
            headerAlign: "center",
            headerName: "Amount", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : params.row.amount ? params.row.amount : "--",
        },
        {
            field: "balance_due",
            align: "center",
            headerAlign: "center",
            headerName: "Balance Due", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : ["", null, undefined].includes(params.row.balance_due) ? "--" : params.row.balance_due,
        },
        {
            field: "status",
            align: "center",
            headerAlign: "center",
            headerName: "Status", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> :
                    <Text className={`${classes.statuText} ${params.row.label === 'Submit' ? classes.green : ""}  ${params.row.label === 'Rejected' ? classes.red : ""} ${params.row.label === 'Drafted' ? classes.orange : ''}`}>
                        {params.row.label ? params.row.label : "--"}
                    </Text>
        },
    ];



    const paymentsColumns = [
        {
            field: "payment_ref_no",
            align: "center",
            headerAlign: "center",
            headerName: "Payment Number",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : ["", null, undefined].includes(params.row.payment_ref_no) ? "--" : params.row.invoice_id,

        },
        {
            field: "invoice_numbers",
            align: "center",
            headerAlign: "center",
            headerName: "Invoice Number", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : params.row.invoice_numbers.length > 0 ? params.row.invoice_numbers.map(i => i.no).toString() : "--",
        },
        {
            field: "amount",
            align: "center",
            headerAlign: "center",
            headerName: "Amount", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : ["", null, undefined].includes(params.row.amount) ? "--" : params.row.amount,
        },
        {
            field: "payment_type",
            align: "center",
            headerAlign: "center",
            headerName: "Payment Mode", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : ["", null, undefined].includes(params.row.payment_type) ? "--" : params.row.payment_type,
        },
    ];
    const consultantColumns = [
        {
            field: "employee_name",
            align: "center",
            headerAlign: "center",
            headerName: "Consultant Name",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : ["", null, undefined].includes(params.row.employee_name) ? "--" : params.row.employee_name,

        },
        {
            field: "reference_id",
            align: "center",
            headerAlign: "center",
            headerName: "Placement Number", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : ["", null, undefined].includes(params.row.reference_id) ? "--" : params.row.reference_id,
        },
        {
            field: "project_start_date",
            align: "center",
            headerAlign: "center",
            headerName: "Project Start Date", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : ["", null, undefined].includes(params.row.project_start_date) ? "--" : params.row.project_start_date,
        },
        {
            field: "bill_rate",
            align: "center",
            headerAlign: "center",
            headerName: "Bill Rate", sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) =>
                loading ? <Skeleton animation="wave" width="100px" /> : ["", null, undefined].includes(params.row.bill_rate) ? "--" : params.row.bill_rate,
        },
    ];

    return (
        <Box p={2}>

            <Box mx={1} my={2} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >
                <Text profileTitle >
                    Transactions
                </Text>
            </Box>

            <Box mx={1} sx={{ borderBottom: 1, borderColor: 'divider', }}>
                <Tabs
                    value={tab}
                    onChange={handleChangeTab}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    {
                        transactionsTab.map((item, key) => (
                            <Tab key={key} label={item} {...a11yProps(0)} className={`${classes.tabTitle}  ${tab === key ? classes.activeTabTitle : null}`} />
                        ))
                    }
                </Tabs>
            </Box>
            <Box mx={1} py={2} >
                <CustomTabPanel value={tab} index={0}>
                    <Table
                        rows={invoiceRows}
                        columns={invoiceColumns}
                        hidePagination={true}
                        height={340}

                    />
                </CustomTabPanel>
                <CustomTabPanel value={tab} index={1}>
                    <Table
                        rows={paymentRows}
                        columns={paymentsColumns}
                        hidePagination={true}
                        height={340}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={tab} index={2}>
                    <Table
                        rows={consultantRows}
                        columns={consultantColumns}
                        hidePagination={true}
                        height={340}

                    />
                    {/* <Table
                        rows={invoiceRowTest}
                        columns={contractorsColumns}
                        rowCount={total ? total : ""}
                        pageSize={pageSize}
                        height={320}
                    /> */}
                </CustomTabPanel>
            </Box>
        </Box>
    );
}