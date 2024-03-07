import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Avatar } from '@mui/material';
import Text from '../../../components/customText/Text';
import { ReactComponent as AvatarIcon } from '../../../assets/svg/avatar.svg';

function createData(name, calories, fat, carbs, protein, price) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        price,
        history: [
            {
                date: '2020-01-05',
                customerId: '11091700',
                amount: 3,
            },
            {
                date: '2020-01-02',
                customerId: 'Anonymous',
                amount: 1,
            },
        ],
    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'none !important', }, }}>
                <TableCell align='left'>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', }}>
                        <Avatar>
                            <AvatarIcon />
                        </Avatar>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '40px' }}>
                            <Text sx={{ font: '12px Nunito !important', fontWeight: `${600} !important`, color: '#0C75EB' }}>Jacob Jones</Text>
                            <Text sx={{ font: '12px Nunito !important', fontWeight: `${500} !important`, color: '#404040' }}>12345</Text>
                        </Box>
                    </Box>
                </TableCell>
                <TableCell align="left" sx={{color:'#16A34A', font:'12px Nunito !important', fontWeight:`${500} !important`}}>{row.calories}</TableCell>
                <TableCell align="left">{row.fat}</TableCell>
                <TableCell align="left">{row.carbs}</TableCell>
                <TableCell align="left">{row.protein}</TableCell>
                <TableCell align="left">{row.price}</TableCell>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ padding:'0px 50px 0px 20px'}} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, height:'82px', width:'100%', borderRadius:'10px', background:'#FAFAFA !important', marginBottom:'12px', padding:'20px 54px 20px 40px', display:'flex', justifyContent:'space-between'}}>
                           <Box sx={{display:'flex', flexDirection:'column', gap:1}}>
                           <Text sx={{ font: '14px Nunito !important', fontWeight: `${500} !important`, color: '#737373' }}>Project Name</Text>
                           <Text sx={{ font: '14px Nunito !important', fontWeight: `${500} !important`, color: '#171717' }}>Work Force</Text>
                           </Box>
                           <Box sx={{display:'flex', flexDirection:'column', gap:1}}>
                           <Text sx={{ font: '14px Nunito !important', fontWeight: `${500} !important`, color: '#737373' }}>Notice Period</Text>
                           <Text sx={{ font: '14px Nunito !important', fontWeight: `${500} !important`, color: '#171717' }}>20 </Text>
                           </Box>
                           <Box sx={{display:'flex', flexDirection:'column', gap:1}}>
                           <Text sx={{ font: '14px Nunito !important', fontWeight: `${500} !important`, color: '#737373' }}>Project End Date</Text>
                           <Text sx={{ font: '14px Nunito !important', fontWeight: `${500} !important`, color: '#171717' }}>22/12/2024</Text>
                           </Box>
                           <Box sx={{display:'flex', flexDirection:'column', gap:1, mr:'35px'}}>
                           <Text sx={{ font: '14px Nunito !important', fontWeight: `${500} !important`, color: '#737373' }}>End Client Name</Text>
                           <Text sx={{ font: '14px Nunito !important', fontWeight: `${500} !important`, color: '#171717' }}>Micro</Text>
                           </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        calories: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.number.isRequired,
                customerId: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
    }).isRequired,
};

const rows = [
    createData('Frozen yoghurt',' PLS-11', 'Louis Vuitton', '22/12/2023', 'Semi Monthly', '$50'),
    createData('Frozen yoghurt',' PLS-11', 'Louis Vuitton', '22/12/2023', 'Semi Monthly', '$50'),
    createData('Frozen yoghurt',' PLS-11', 'Louis Vuitton', '22/12/2023', 'Semi Monthly', '$50'),
    createData('Frozen yoghurt',' PLS-11', 'Louis Vuitton', '22/12/2023', 'Semi Monthly', '$50'),
    createData('Frozen yoghurt',' PLS-11', 'Louis Vuitton', '22/12/2023', 'Semi Monthly', '$50'),
];

export default function CollapsibleTable() {
    return (
        <TableContainer component={Paper} sx={{maxHeight:'500px', borderRadius:'10px', boxShadow: '0px 2px 24px 0px #919EAB1F'}} elevation={0} >
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow sx={{ background: '#F6F6F6 !important',}}>
                        <TableCell align='left' sx={{ font: '16px Nunito !important', fontWeight: `${500} !important`, width:'200px' }}>Employee Name</TableCell>
                        <TableCell align="left" sx={{ font: '16px Nunito !important', fontWeight: `${500} !important`,width:'211px' }}>Placement ID</TableCell>
                        <TableCell align="left" sx={{ font: '16px Nunito !important', fontWeight: `${500} !important`,width:'211px' }}>Client Name</TableCell>
                        <TableCell align="left" sx={{ font: '16px Nunito !important', fontWeight: `${500} !important`,width:'211px' }}>Project Start Date</TableCell>
                        <TableCell align="left" sx={{ font: '16px Nunito !important', fontWeight: `${500} !important`,width:'211px' }}>Timesheet Cycle</TableCell>
                        <TableCell align="left" sx={{ font: '16px Nunito !important', fontWeight: `${500} !important`,width:'150px' }}>Bill Rate</TableCell>
                        <TableCell sx={{width:'52px'}}/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.name} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
