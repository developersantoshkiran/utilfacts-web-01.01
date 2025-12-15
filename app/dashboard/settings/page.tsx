"use client";

import { useState } from "react";
import * as React from "react";
import { MaterialReactTable } from "material-react-table";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import styles from "../page.module.scss";
import Button from "@mui/material/Button";
import "dayjs/locale/en-gb";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import { mkConfig, generateCsv, download } from "export-to-csv";
import CancelIcon from "@mui/icons-material/Cancel";
import InputAdornment from "@mui/material/InputAdornment";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useSWR from "swr";
// import ManualBillGenDialog from "./manualBillGenDialog";
import dayjs from "dayjs";
import { useContext } from "react";
import { FileDownload } from "@mui/icons-material";
import { SessionContext } from "@/app/_providers/sessionProvides";
import { GET, POST } from "@/app/utils/api";
// import BillDetails from "./billDetailsDialog";

export default function Page() {
    let session = useContext(SessionContext)
    const [selectedValue, setSelectedValue] = useState("users");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedValue(newValue);
    };

    const config = [
        {
            label: "Services",
            value: "services",
            show: true,
            Comp({ index, show, value }: any) {
                return <>Services</>
            }
        },
        {
            label: "Groups and Entities",
            value: "groupsentities",
            show: false,
             Comp({ index, show, value }: any) {
                return <>Groups and Entities</>
            }
        },
        {
            label: "Users",
            value: "users",
            show: true,
            Comp({ index, show, value }: any){
                return <TabPanel
                    key={index}
                    show={show}
                    value={value}
                >

                </TabPanel>
            }
        },
        {
            label: "Alerts",
            value: "alerts",
            show: false,
        },
        {
            label: "Notifications",
            value: "notifications",
            show: false,
        },
    ];

    return (
        <>
            <div>
                <div
                    className={"app_title"}
                    style={{
                        paddingBottom: "24px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <span>Settings</span>
                    {/* <ManualBillGenDialog /> */}
                </div>
                <Tabs
                    value={selectedValue}
                    onChange={handleChange}
                    aria-label='wrapped label tabs example'
                >
                    {config.map(({ value, label }, index) => (
                        <Tab key={index} value={value} label={label} />
                    ))}
                </Tabs>
                {config.map(({ Comp, value, show }, index) => {

                    if (!show) {
                        return
                    }
                    if (selectedValue !== value) {
                        return
                    }
                    if (!Comp) {
                        return
                    }
                    return <Comp key={index}></Comp>
                }
                )}
            </div>
        </>
    );
}

function TabPanel({ children, selectedValue, show, value, ...other }: any) {
    const [status, setstatus] = useState("");
    const [ownerShipType, setOwnerShipType] = useState("");
    const [date, setDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div
            role='tabpanel'
            hidden={selectedValue !== value}
            id={`full-width-tabpanel-${value}`}
            aria-labelledby={`full-width-tab-${value}`}
            {...other}
        >

            <>
                <div
                    className={styles.dashboard_title}
                    style={{
                        paddingTop: "24px",
                        display: "flex",
                        paddingBottom: "24px",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>All Users</span>
                    <div>
                        <FormControl sx={{ minWidth: 120, marginRight: 3 }}>
                            <InputLabel id='demo-simple-select-label'>Status</InputLabel>
                            <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                value={status}
                                label='Status'
                                onChange={(event) => setstatus(event.target.value as string)}
                                renderValue={(selected) => (
                                    <div>
                                        <Chip
                                            key={selected}
                                            label={selected}
                                            clickable
                                            deleteIcon={
                                                <CancelIcon
                                                    onMouseDown={(event: any) =>
                                                        event.stopPropagation()
                                                    }
                                                />
                                            }
                                            onDelete={(e: any) => setstatus("")}
                                            onClick={() => console.log("clicked chip")}
                                        />
                                    </div>
                                )}
                            >
                                <MenuItem value={"Approved"}>Approved</MenuItem>
                                <MenuItem value={"Pending"}>Pending</MenuItem>
                                <MenuItem value={"Denied"}>Denied</MenuItem>

                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120, marginRight: 3 }}>
                            <InputLabel id='ownershiptype-select-label'>Ownership Type</InputLabel>
                            <Select
                                labelId='ownershiptype-select-label'
                                id='ownershiptype-select'
                                value={ownerShipType}
                                label='Ownership Type'
                                onChange={(event) => setOwnerShipType(event.target.value as string)}
                                renderValue={(selected) => (
                                    <div>
                                        <Chip
                                            key={selected}
                                            label={selected}
                                            clickable
                                            deleteIcon={
                                                <CancelIcon
                                                    onMouseDown={(event: any) =>
                                                        event.stopPropagation()
                                                    }
                                                />
                                            }
                                            onDelete={(e: any) => setOwnerShipType("")}
                                            onClick={() => console.log("clicked chip")}
                                        />
                                    </div>
                                )}
                            >
                                <MenuItem value={"Owner"}>Owner</MenuItem>
                                <MenuItem value={"Tenant"}>Tenant</MenuItem>


                            </Select>
                        </FormControl>
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale='en-gb'
                        >
                            <DatePicker
                                slotProps={{
                                    field: { clearable: true, onClear: () => setDate(null) },
                                }}
                                label='Request Date'
                                value={date}
                                format='DD/MM/YYYY'
                                onChange={(value) => setDate(value as any)}
                            />
                        </LocalizationProvider>
                        <FormControl
                            sx={{ minWidth: 120, marginLeft: 3 }}
                            variant='filled'
                        >
                            <InputLabel htmlFor='search-by-entity'>
                                Search By User, Entity
                            </InputLabel>
                            <OutlinedInput
                                id='search-by-entity'
                                value={searchTerm}
                                onInput={(event) =>
                                    setSearchTerm(event.target && (event.target as any)?.value)
                                }
                                endAdornment={
                                    <InputAdornment position='end'></InputAdornment>
                                }
                            />
                        </FormControl>
                    </div>
                </div>

                <TableCom
                    show={show}
                    status={status}
                    searchTerm={searchTerm}
                    ownerShipType={ownerShipType}
                    date={date ? dayjs(date).format("YYYY-MM-DD") : null}
                ></TableCom>

                {children}
            </>

        </div>
    );
}

function TableCom({
    status: statusFilter,
    date,
    ownerShipType,
    searchTerm = "",
}: any): React.JSX.Element {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const {
        data = [],
        isLoading,
        error,
        mutate
    } = useSWR(
        `/entities/pendingapproval?ownerShipType=${ownerShipType}&status=${statusFilter}&dueDate=${date}&searchTerm=${searchTerm}`
    );

    async function onApproveClick(userEntityId: string, projectId: string, entityId: string) {
        await POST('/entities/approve', {
            userEntityId,
            projectId,
            entityId

        }).then(() => {
            mutate()
        }).catch((error) => {
            console.log(error)
        })
    }

    function onRejectClick(userEntityId: string, projectId: string, entityId: string) {

    }
    let pendingApprovalRequests = data

    const columns = [
        {
            accessorKey: "users.name",
            size: 220,
            header: "User Name",
            muiTableBodyCellProps: ({ cell }: any) => ({
                sx: {
                    color: "#6E5DE7",
                    fontWeight: "bold",
                },
            }),
        },
        { accessorKey: "entities.entity", size: 50, header: "Entity" },
        {
            accessorKey: "users.mobile",
            header: "Mobile Number",
            size: 150,

        },
        {
            accessorKey: "users.email",
            header: "Email ID",
            size: 150,
        },
        { accessorKey: "ownership_types.ownershipType", size: 50, header: "Ownership Type" },
        {
            accessorKey: "user_entities.createdAt", size: 180, header: "Created On", Cell: ({ renderedCellValue }: any) => {
                return renderedCellValue
                    ? dayjs(renderedCellValue).format("DD-MM-YYYY")
                    : "";
            },
        },
        { accessorKey: "entity_approval_statuses.status", size: 50, header: "Status" },
        {
            accessorKey: "",
            id: 'action',
            size: 100,
            header: "Action",
            Cell: ({ row: { original } }: any) => {
                if (original.entity_approval_statuses.status !== 'Pending') {
                    return <div></div>
                }
                return <div style={{ display: "flex" }}>
                    <Button onClick={() => onApproveClick(original.user_entities.id, original.projects.id, original.entities.id)}
                        style={{
                            marginRight: '3px'
                        }} variant="contained">Approve</Button>
                    <Button onClick={() => onRejectClick(original.user_entities.id, original.projects.id, original.entities.id)}
                        color="warning" variant="contained">Reject</Button>
                </div>
            }
        },

    ];

    if (isLoading) {
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        );
    }

    if (error) {
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' colSpan={22}>
                                Cant fetch Data
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        );
    }

    const csvConfig = mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true,
    });

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

    const handleRowClick = (row: any) => {
        setSelectedRowData(row.original); // Save the row data
        setDrawerOpen(true); // Open the drawer
    };

    // Close the drawer
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    return (
        <>
            <MaterialReactTable
                enableStickyHeader={true}
                enableColumnActions={false}
                enableColumnFilters={false}
                columns={columns}
                muiTableBodyRowProps={({ row }) => ({
                    onClick: () => handleRowClick(row),
                    sx: {
                        cursor: "pointer",
                    },
                })}
                data={pendingApprovalRequests}
                initialState={{ pagination: { pageSize: 5, pageIndex: 0 } }}
                enableSorting={false}
                renderTopToolbar={({ table }) => (
                    <Box
                        sx={{
                            display: "flex",
                            gap: "16px",
                            paddingTop: "24px",
                            paddingLeft: "16px",
                            flexWrap: "wrap",
                        }}
                    >
                        {/* <Button
                            variant='contained'
                            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                            onClick={handleExportData}
                            startIcon={<FileDownload />}
                        >
                            Export Data
                        </Button> */}
                    </Box>
                )}
            />
            {/* <BillDetails
        open={drawerOpen}
        onClose={handleCloseDrawer}
        rowData={selectedRowData}
      /> */}
        </>
    );
}
