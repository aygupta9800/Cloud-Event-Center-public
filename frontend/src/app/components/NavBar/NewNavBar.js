/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import DehazeIcon from '@material-ui/icons/Dehaze';
import { makeStyles } from '@material-ui/core/styles';
import SideBarList from "./SideBarList";
// import TextField from '@mui/material/TextField';
import { useHistory } from 'react-router-dom';
import {
    ListItemText,
    Avatar,
    Divider,
    Toolbar,
    ListItemIcon,
    List,
    Box,
    AppBar,
    ListItem,
    IconButton,
    Button,
    Typography,
    CssBaseline,
} from '@material-ui/core';
import appLogo from '../../cloud_event_center_logo.png'
import {
    Home
} from '@material-ui/icons';
import MobileeRightMenuSlider from '@material-ui/core/Drawer';
import axios from 'axios';

// CSS styles
const useStyles = makeStyles(theme=>({
    sidebarContainer: {
        background: 'rgb(36,36,36)',
        height: '100%',
        width: '100%',
        minWidth: '250px',
        paddingTop: '60px'
    },
    icon: {
        display: 'block',
        margin: '0.4rem auto',
        marginBottom: '3rem',
        width: theme.spacing(12),
        height: theme.spacing(12),
        borderRadius: 0,
    },
    listItemStyle: {
        color: 'black'
    },
    titleStyle: {
        color: 'rgb(81,181,168)',
        fontSize: 20,
        paddingBottom: 30,
    },
}));
const logout = ()=> {
    window.localStorage.clear();
}
const Navigationbar = (props) => {
    const classes = useStyles();
    const currentUserId = localStorage.getItem("userId");
    const currentUserStatus = currentUserId ? 1 : 2;
    const [state, setState] = useState({ right: false })

    const toggleSlider = (slider, open) => () => {
        setState({...state, [slider]: open});
    };
    const menuItems = SideBarList;

    const sidebarList = slider => (
        <Box component='div'
            className={classes.sidebarContainer}
            onClick={toggleSlider(slider, false)}
        >
            <div style={{ flex: 1, textAlign: 'center', alignItems: 'center'}}>
                <Typography className={classes.titleStyle}> Cloud Event Center</Typography>
            </div>
            {/* <Avatar className={classes.icon} src={avatar} alt='' /> */}
            <Divider />
            <List>
            {/* component={Link} to={listItem.itemPath} */}
                {menuItems.map((listItem, key) => (
                    listItem.itemStatus == 0 || currentUserStatus === listItem.itemStatus
                    ?// list
                    (<ListItem button key={key}>
                        {/* <ListItemIcon className={classes.listItemStyle}>{listItem.itemIcon}</ListItemIcon> */}
                        <Button href={listItem.itemPath}  style={{color: 'white'}}>
                            {listItem.itemText}
                        </Button>
                    </ListItem>):
                    <></>
                ))}
                {currentUserStatus===1 && <Button href={'/signin'} onClick={logout} style={{marginLeft:'18px', color: 'white'}}>Logout</Button>}
            </List>
        </Box>
    );
    return (
        <>
            <Box component='nav' style={{marginBottom: 85}}>
                <CssBaseline />
                <AppBar  style={{background: 'rgb(36,36,36)'}}>
                    <Toolbar style={{display: 'flex', width: '100%'}}>
                        <MobileeRightMenuSlider open={state.right}
                            onClose={toggleSlider('right', false)}
                            anchor='left'>
                            {sidebarList('left')}
                        </MobileeRightMenuSlider>
                        <div style={{ display: "flex", width: '100%', flex: 1, justifyContent: 'space-between'}}>
                            <div style={{display: "flex", width: '100%', flexDirection: 'row', alignItems:'center'}}>
                               <div>
                                    <IconButton onClick={toggleSlider('right', true)}>
                                        <DehazeIcon style={{color: 'white'}} />
                                    </IconButton>
                               </div>
                               <div>
                                   <Typography style={{color: 'white'}}> System Time: {new Date(localStorage.getItem('systemTime')).toLocaleString()}</Typography>
                               </div>
                               <div style={{  display: 'flex', flex: 1,  justifyContent: 'flex-end'}}>
                                    <img src={appLogo} alt='' style={{ width: 160, height: 82}} />
                                </div>
                            </div>
                         </div>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}

export default Navigationbar;
