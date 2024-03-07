import { makeStyles } from "@mui/styles";

const SidebarStyles = makeStyles(() => ({

    // sidebar

    sidebar: {
        position: "fixed",
        maxWidth: "75px",
        width: "100%",
        background: "#FFFFFF",
        top: 0,
        left: 0,
        height: "100%",
        overflowY: "auto",
        overflowX: 'hidden',
        scrollbarWidth: "none",
        transition: "all .3s ease",
        zIndex: 200,
        boxShadow: "3px 3px 5px -1px rgba(0, 0, 0, 0.05)",
        "&::-webkit-scrollbar": {
            display: 'none',
        },
    },
    sidebar2: {
        position: "fixed",
        maxWidth: "75px",
        width: "100%",
        background: "#FFFFFF",
        top: 0,
        left: 0,
        height: "100%",
        overflowY: "auto",
        overflowX: 'hidden',
        scrollbarWidth: "none",
        transition: "all .3s ease",
        zIndex: 200,
        // boxShadow: "3px 3px 5px -1px rgba(0, 0, 0, 0.05)",
        "&::-webkit-scrollbar": {
            display: 'none',
        },
    },

    sidebarOpen: {
        maxWidth: "260px",
    },

    brand: {
        fontSize: "24px",
        display: "flex",
        alignItems: "center",
        height: "64px",
        fontWeight: 600,
        color: "rgba(24, 26, 24, 1)",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 100,
        background: "rgba(255, 255, 255, 1)",
        transition: "all .3s ease",
        // padding: "0 18px",
        padding: "0 12px",
    },

    sideMenu: {
        margin: "30px 0px 30px 0",
        // padding: "0 20px",
        padding: "0 10px",
        transition: "all .3s ease",
        backgroundColor: "rgba(255, 255, 255, 1)",
        height: '100%',
    },
    sidebarLink: {
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        color: "rgba(24, 26, 24, 1)",
        padding: "12px 15.5px",
        transition: "all .3s ease",
        borderRadius: "8px",
        margin: "6px 0",
        whiteSpace: "nowrap",
        cursor: "pointer",
    },

    sidebarLinkActive: {
        backgroundColor: "rgba(12, 117, 235, 1)",
        color: "#FFFFFF",
        transition: "all .3s ease",
        boxShadow: '0px 0px 15px 1px rgba(12, 117, 235, 0.30) !important'
    },

    sidebarLinkTextMs: {
        margin: "0px 14px",
        transition: "all .3s ease",
    },
    sidebarLinkTextMl: {
        margin: "0px 26px",
        transition: "all .3s ease",
    },

    sideDropdown: {
        marginLeft: "42px",
        paddingLeft: "8px",
        maxHeight: "0px",
        overflowY: "hidden",
        transition: "all .3s ease",
        "&::-webkit-scrollbar": {
            display: 'none',
        },

        borderLeft: "1px solid rgba(12, 117, 235, 1)"
    },

    sideDropdownShow: {
        maxHeight: "1000px",
        transition: "all .3s ease",
    },
    sidebarSideDropdownLink: {
        display: "flex",
        alignItems: "center",
        color: "rgba(24, 0, 24, 1)",
        padding: "10px 14px",
        transition: "all .3s ease",
        borderRadius: "10px",
        margin: "4px 0",
        whiteSpace: "nowrap",
        fontSize: "16px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontWeight: "500",
    },

    menuSelected: {
        display: "flex",
        alignItems: "center",
        color: "#0C75EB",
        padding: "10px 14px",
        transition: "all .3s ease",
        borderRadius: "10px",
        margin: "4px 0",
        whiteSpace: "nowrap",
        fontSize: "16px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontWeight: "500",
    },

    sideTooltip: {
        height: "34px",
        width: "100%",
        display: "flex",
        alignItems: "center",
    },

    sideTooltipText: {
        fontSize: "16px",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontWeight: "500",
        color: "#FFFFFF",
    },

    nestedListMainContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    nestedListContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    bottomTextPosition: {
        position: "fixed",
        bottom: "0px",
        paddingBottom: 5,
        padding: '0px 45px 0px 0px !important',
        background: 'rgba(255, 255, 255, 1)',
        textAlign: 'center',
    },
    bottomTextPositionCls: {
        position: "fixed",
        bottom: "0px",
        paddingBottom: 5,
        textAlign: 'left',
        padding: '0px',
        background: 'rgba(255, 255, 255, 1)'
    },
    logo: {
        height: '50px !important',
        width: '85px !important'
    },
    logoCls: {
        height: '35px !important',
        width: '55px !important',
    },
    versionText: {
        font: '8px !important',
        textDecoration: '1px underline blue !important',
        color: 'blue !important'
    }
}))


export default SidebarStyles;