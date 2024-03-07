import React, { useEffect } from 'react'
import VendorProfileStyles from './VendorProfileStyles';
import { Box, Grid, Skeleton, Tab } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import { useState } from 'react';
import Text from '../../../../components/customText/Text';
import Table from '../../../../components/table/Table';
// import IBM from '../../../../assets/client/IBM.svg';
// import WellsFargo from '../../../../assets/client/WellsFargo.svg';
// import ishika from '../../../../assets/client/ishika.svg';
// import john from '../../../../assets/client/john.svg';
// import CircularProgress from '../../../../components/progressbar/CircularProgress';
import ClientsAPI from '../../../../apis/admin/clients/ClientsApi';
import { useLocation } from 'react-router-dom';

function Transactions() {
    const classes = VendorProfileStyles();
    const location = useLocation();
    const [tab, setTab] = useState(1);
    const [pagination, setPagination] = useState(
        {
            total: "",
            currentPage: 1,
            perPage: 4,
            totalPages: ""
        }
    );
    const [billsRows, setBillsRows] = useState([]);
    const [paymentRows, setPaymentRows] = useState([]);
    const [consultantRows, setConsultantRows] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (tab == 1) {
            getInvoiceList(pagination);
        }
        if (tab == 2) {
            getPaymentList(pagination);
        }

        if (tab == 3) {
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
                    setBillsRows(res.data.data);
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

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    // const columns = [
    //     {
    //         field: "bill_no",
    //         align: "left",
    //         headerAlign: "left",
    //         headerName: <Box pl={4}>{tab == '1' || tab == '2' ? 'Bill No' : tab == '3' ? 'Contactor' : ''}</Box>,
    //         sortable: false,
    //         disableColumnMenu: true,
    //         flex: 1,
    //         renderCell: (cellValues) => {
    //             return (
    //                 <Box display='flex' flexDirection='row'>
    //                     {loading ? <Skeleton animation="wave" width="40px" height='65px' style={{ borderRadius: '50%' }} /> :
    //                         <CircularProgress
    //                             value={100}
    //                             size={48}
    //                             color='#037847'
    //                             imgWidth='38px'
    //                             imgHeight='40px'
    //                             // src={<img src={cellValues.row.document_url} alt='clients' style={{ height: '45px', width: '45px', borderRadius: '50%' }} />}
    //                             // src={cellValues ? cellValues.row.document_url : '/broken-image.jpg'}
    //                             src={cellValues ? cellValues.row.logo : '/broken-image.jpg'}
    //                         />
    //                     }
    //                     <Box p={'7px 10px 5px 15px'}>
    //                         <Text smallBlue nowrap>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.name}</Text>
    //                         <Text smallBlack sx={{ paddingTop: '5px !important' }} nowrap>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.date}</Text>
    //                     </Box>
    //                 </Box>
    //             )
    //         }
    //     },
    //     {
    //         field: "order_number",
    //         align: "center",
    //         headerAlign: "center",
    //         headerName: <Box>{tab == '1' ? "Order Number" : tab == '2' ? 'Payment' : ''}</Box>,
    //         sortable: false,
    //         disableColumnMenu: true,
    //         flex: 1,
    //         renderCell: (params) =>
    //             loading ? <Skeleton animation="wave" width="100px" /> : params.row.order_number ? params.row.order_number : "--",
    //     },
    //     {
    //         field: "amount",
    //         align: "center",
    //         headerAlign: "center",
    //         headerName: <Box>{tab == '1' ? "Amount" : tab == '2' ? 'Payment Mode' : ''}</Box>,
    //         sortable: false,
    //         disableColumnMenu: true,
    //         flex: 1,
    //         renderCell: (params) =>
    //             loading ? <Skeleton animation="wave" width="100px" /> : params.row.amount ? params.row.amount : "--",
    //     },
    //     {
    //         field: "balance_due",
    //         align: "center",
    //         headerAlign: "center",
    //         headerName: <Box>{tab == '1' ? "Balance Due" : tab == '2' ? 'Amount Recieved' : ''}</Box>,
    //         sortable: false,
    //         disableColumnMenu: true,
    //         flex: 1,
    //         renderCell: (params) =>
    //             loading ? <Skeleton animation="wave" width="100px" /> :
    //                 <>
    //                     {
    //                         tab == '1' || tab == '2' ? params.row.balance_due ? params.row.balance_due : "--" : tab == '3' ? params.row.client : ''
    //                     }
    //                 </>

    //     },
    //     {
    //         field: <Box>{tab == '1' ? "status" : tab == '2' ? "due_amount" : ''}</Box>,
    //         align: "center",
    //         headerAlign: "center",
    //         headerName: <Box>{tab == '1' ? "Status" : tab == '2' ? 'Due Amount' : ''}</Box>,
    //         sortable: false,
    //         disableColumnMenu: true,
    //         flex: 1,
    //         renderCell: (params) =>
    //             loading ? <Skeleton animation="wave" width="100px" /> :
    //                 <>
    //                     {
    //                         tab == '1' ? <Text className={params.row.status === 'Paid' ? classes.green : params.row.status === 'Partially Paid' ? classes.orange : ''}>
    //                             {params.row.status ? params.row.status : '--'}
    //                         </Text> : tab == '2' ? params.row.due_amount ? params.row.due_amount : '--' : ''
    //                     }
    //                 </>

    //     }
    // ]

    // const contractorColumn = [
    //     {
    //         field: "contractor",
    //         align: "left",
    //         headerAlign: "left",
    //         headerName: 'Contractor',
    //         sortable: false,
    //         disableColumnMenu: true,
    //         flex: 1,
    //         renderCell: (cellValues) => {
    //             return (
    //                 <Box display='flex' flexDirection='row'>
    //                     {loading ? <Skeleton animation="wave" width="40px" height='65px' style={{ borderRadius: '50%' }} /> :
    //                         <CircularProgress
    //                             value={100}
    //                             size={48}
    //                             color='#037847'
    //                             imgWidth='38px'
    //                             imgHeight='40px'
    //                             src={cellValues ? cellValues.row.logo : '/broken-image.jpg'}
    //                         />
    //                     }
    //                     <Box p={'7px 10px 5px 15px'}>
    //                         <Text smallBlue nowrap>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.client}</Text>
    //                         <Text smallBlack sx={{ paddingTop: '5px !important' }} nowrap>{loading ? <Skeleton animation="wave" width="100px" /> : cellValues.row.userID}</Text>
    //                     </Box>
    //                 </Box>
    //             )
    //         }
    //     },
    //     {
    //         field: "client",
    //         align: "center",
    //         headerAlign: "center",
    //         headerName: 'Client',
    //         sortable: false,
    //         disableColumnMenu: true,
    //         flex: 1,
    //         renderCell: (params) =>
    //             loading ? <Skeleton animation="wave" width="100px" /> : params.row.client ? params.row.client : "--",
    //     },
    //     {
    //         field: "hours",
    //         align: "center",
    //         headerAlign: "center",
    //         headerName: 'Hours',
    //         sortable: false,
    //         disableColumnMenu: true,
    //         flex: 1,
    //         renderCell: (params) =>
    //             loading ? <Skeleton animation="wave" width="100px" /> : params.row.hours ? params.row.hours : "--",
    //     },
    //     {
    //         field: "bill_rate",
    //         align: "center",
    //         headerAlign: "center",
    //         headerName: 'Bill Rate',
    //         sortable: false,
    //         disableColumnMenu: true,
    //         flex: 1,
    //         renderCell: (params) =>
    //             loading ? <Skeleton animation="wave" width="100px" /> : params.row.bill_rate ? params.row.bill_rate : "--"

    //     },
    //     {
    //         field: 'status',
    //         align: "center",
    //         headerAlign: "center",
    //         headerName: 'Status',
    //         sortable: false,
    //         disableColumnMenu: true,
    //         flex: 1,
    //         renderCell: (params) =>
    //             loading ? <Skeleton animation="wave" width="100px" /> :
    //                 <Text className={params.row.status === 'In-Project' ? classes.green : classes.greyText}>
    //                     {params.row.status ? params.row.status : '--'}
    //                 </Text>
    //     }
    // ]

    // const billRows = [
    //     {
    //         id: 1,
    //         bill_no: '1',
    //         name: 'Wipro',
    //         date: '11-sep-23',
    //         order_number: 'GG-783989092',
    //         amount: '$6879',
    //         balance_due: '$898',
    //         status: 'Partially Paid',
    //         logo: IBM,
    //         due_amount: '$50'
    //     },
    //     {
    //         id: 2,
    //         bill_no: '2',
    //         name: 'Cognizant',
    //         date: '11-Aug-23',
    //         order_number: 'IBM-87739983',
    //         amount: '$567',
    //         balance_due: '$999',
    //         status: 'Paid',
    //         logo: WellsFargo,
    //         due_amount: '$50'
    //     }
    // ]

    // const contractorRows = [
    //     {
    //         id: 1,
    //         name: 'Wirpo',
    //         userID: '78578687',
    //         client: 'Ishika',
    //         hours: '28',
    //         bill_rate: '$898',
    //         status: 'Project Ended',
    //         logo: ishika,
    //     },
    //     {
    //         id: 2,
    //         name: 'Wipro',
    //         userID: '78578669',
    //         client: 'John',
    //         hours: '12',
    //         bill_rate: '$898',
    //         status: 'In-Project',
    //         logo: john,
    //     }
    // ]


    const billsColumns = [
        {
            field: "invoice_id",
            align: "center",
            headerAlign: "center",
            headerName: "Bill Number",
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
                <Grid container lg={12} pt={1} pl={2}>
                    <Grid item lg={12}>
                        <Text largeBlack>Transactions</Text>
                    </Grid>
                    <Grid item lg={12} pt={2}>
                        <TabContext value={tab}>
                            <Box sx={{ borderBottom: '1px solid #E2E5E6 !important', borderColor: 'divider', width: '100%' }}>
                                <TabList onChange={handleChange}>
                                    <Tab label='Bills' value={1} className={tab == 1 ? classes.activeText : classes.tabText} />
                                    <Tab label='Payments' value={2} className={tab == 2 ? classes.activeText : classes.tabText} />
                                    <Tab label='Contractors' value={3} className={tab == 3 ? classes.activeText : classes.tabText} />
                                </TabList>
                            </Box>
                        </TabContext>
                        {console.log(tab, " tab tab tab tab")}
                    </Grid>
                    <Grid item xs={12} pt={3}>
                        {
                            tab == "1" ?
                                <Box>
                                    <Table
                                        rows={billsRows}
                                        columns={billsColumns}
                                        height={400}
                                    />
                                </Box> :
                                tab == "2" ?
                                    <Table
                                        rows={paymentRows}
                                        columns={paymentsColumns}
                                        height={400}
                                    /> :
                                    tab == "3" ?
                                        <Table
                                            rows={consultantRows}
                                            columns={consultantColumns}
                                            height={400}
                                        /> : ''
                        }
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default Transactions