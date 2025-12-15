"use client";

import { useState } from "react";
import * as React from "react";
import { MaterialReactTable } from "material-react-table";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styles from "../page.module.scss";
import Button from "@mui/material/Button";
import dayjs, { Dayjs } from "dayjs";
import { FormLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import OutlinedInput from "@mui/material/OutlinedInput";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import CancelIcon from "@mui/icons-material/Cancel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Drawer from "@mui/material/Drawer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import useSWRImmutable from "swr/immutable";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { UPDATE } from "@/app/utils/api";
import { TextField } from "@mui/material";
import { SessionContext } from "@/app/_providers/sessionProvides";

const DATE_FORMAT = "DD-MM-YYYY";

export default function Page() {
  const [selectedValue, setSelectedValue] = useState("dues");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedValue(newValue);
  };

  const config = [
    {
      value: "dues",
      label: "Dues",
      Component: Dues,
    },
    {
      value: "recharge",
      label: "Recharge",
      Component: Recharge,
    },
    {
      value: "history",
      label: "History",
      Component: History,
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
          <span>Payments</span>
          {/* <ManualBillGenDialog /> */}
        </div>
        <Tabs
          value={selectedValue}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
        >
          {config.map(({ value, label }, index) => (
            <Tab key={index} value={value} label={label} />
          ))}
        </Tabs>
        {config.map(({ value, Component }, index) => {
          if (value === selectedValue) {
            return <Component key={index} value={value}></Component>;
          }
        })}
      </div>
    </>
  );
}

function Dues({ value }: any) {
  const [status, setstatus] = useState("");
  const [date, setDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const formattedDate = date ? dayjs(date as Date).format("DD MMM YYYY") : null;
  const url = `/bills?status=${status}&dueDate=${formattedDate}&searchTerm=${searchTerm}`;
  return (
    <div role="tabpanel" aria-labelledby={`full-width-tab-${value}`}>
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
        <span>Due Bills</span>
        <div>
          <FormControl sx={{ minWidth: 120, marginRight: 3 }}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              onChange={(event) => setstatus(event.target.value as string)}
              renderValue={(selected) => (
                <div>
                  <Chip
                    key={selected}
                    label={selected}
                    clickable
                    deleteIcon={
                      <CancelIcon
                        onMouseDown={(event: any) => event.stopPropagation()}
                      />
                    }
                    onDelete={(e: any) => setstatus("")}
                    onClick={() => console.log("clicked chip")}
                  />
                </div>
              )}
            >
              <MenuItem value={"Paid"}>Paid</MenuItem>
              <MenuItem value={"Overdue"}>Overdue</MenuItem>
              <MenuItem value={"Due"}>Due</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              slotProps={{
                field: { clearable: true, onClear: () => setDate(null) },
              }}
              label="Due Range"
              value={date}
              onChange={(value) => setDate(value as any)}
            />
          </LocalizationProvider>
          <FormControl sx={{ minWidth: 120, marginLeft: 3 }} variant="filled">
            <InputLabel htmlFor="standard-adornment-amount">
              Search By entity, Bill No
            </InputLabel>
            <OutlinedInput
              id="standard-adornment-amount"
              value={searchTerm}
              onInput={(event) =>
                setSearchTerm(event.target && (event.target as any)?.value)
              }
              endAdornment={<InputAdornment position="end"></InputAdornment>}
            />
          </FormControl>
        </div>
      </div>
      <DueTable url={url}></DueTable>
    </div>
  );
}

function Recharge({ value }: any) {
  const [status, setstatus] = useState("");
  const [date, setDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const formattedDate = date ? dayjs(date as Date).format("DD MMM YYYY") : null;
  const url = `/ums/project/ganesh/pay?status=${status}&dueDate=${formattedDate}&searchTerm=${searchTerm}`;
  return (
    <div
      role="tabpanel"
      id={`full-width-tabpanel-${value}`}
      aria-labelledby={`full-width-tab-${value}`}
    >
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
        <span>Recharge History</span>
        <div>
          <FormControl sx={{ minWidth: 120, marginRight: 3 }}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              onChange={(event) => setstatus(event.target.value as string)}
              renderValue={(selected) => (
                <div>
                  <Chip
                    key={selected}
                    label={selected}
                    clickable
                    deleteIcon={
                      <CancelIcon
                        onMouseDown={(event: any) => event.stopPropagation()}
                      />
                    }
                    onDelete={(e: any) => setstatus("")}
                    onClick={() => console.log("clicked chip")}
                  />
                </div>
              )}
            >
              <MenuItem value={"Failed"}>Failed</MenuItem>
              <MenuItem value={"Paid"}>Paid</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              slotProps={{
                field: { clearable: true, onClear: () => setDate(null) },
              }}
              label="Date Range"
              value={date}
              onChange={(value) => setDate(value as any)}
            />
          </LocalizationProvider>
          <FormControl sx={{ minWidth: 120, marginLeft: 3 }} variant="filled">
            <InputLabel htmlFor="standard-adornment-amount">
              Search By entity, Bill No, Transaction ID, Remitter
            </InputLabel>
            <OutlinedInput
              id="standard-adornment-amount"
              value={searchTerm}
              onInput={(event) =>
                setSearchTerm(event.target && (event.target as any)?.value)
              }
              endAdornment={<InputAdornment position="end"></InputAdornment>}
            />
          </FormControl>
        </div>
      </div>
      <RechargeTable url={url}></RechargeTable>
    </div>
  );
}

function History({ value }: any) {
  const [status, setstatus] = useState("");
  const [date, setDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const formattedDate = date ? dayjs(date as Date).format("DD MMM YYYY") : null;
  const url = `/bills?status=${status}&dueDate=${formattedDate}&searchTerm=${searchTerm}`;
  return (
    <div
      role="tabpanel"
      id={`full-width-tabpanel-${value}`}
      aria-labelledby={`full-width-tab-${value}`}
    >
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
        <span>Payments History</span>
        <div>
          <FormControl sx={{ minWidth: 120, marginRight: 3 }}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              onChange={(event) => setstatus(event.target.value as string)}
              renderValue={(selected) => (
                <div>
                  <Chip
                    key={selected}
                    label={selected}
                    clickable
                    deleteIcon={
                      <CancelIcon
                        onMouseDown={(event: any) => event.stopPropagation()}
                      />
                    }
                    onDelete={(e: any) => setstatus("")}
                    onClick={() => console.log("clicked chip")}
                  />
                </div>
              )}
            >
              <MenuItem value={"Failed"}>Failed</MenuItem>
              <MenuItem value={"Paid"}>Paid</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              slotProps={{
                field: { clearable: true, onClear: () => setDate(null) },
              }}
              label="Date Range"
              value={date}
              onChange={(value) => setDate(value as any)}
            />
          </LocalizationProvider>
          <FormControl sx={{ minWidth: 120, marginLeft: 3 }} variant="filled">
            <InputLabel htmlFor="standard-adornment-amount">
              Search By entity, Bill No, Transaction ID, Remitter
            </InputLabel>
            <OutlinedInput
              id="standard-adornment-amount"
              value={searchTerm}
              onInput={(event) =>
                setSearchTerm(event.target && (event.target as any)?.value)
              }
              endAdornment={<InputAdornment position="end"></InputAdornment>}
            />
          </FormControl>
        </div>
      </div>
      <HistoryTable url={url}></HistoryTable>
    </div>
  );
}

function HistoryTable({ url }: { url: string }): React.JSX.Element {
  const { data = {}, isLoading, error } = useSWRImmutable(url);
  const bills = data || [];
  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
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
              <TableCell align="center" colSpan={22}>
                Cant fetch Data
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    );
  }
  if (bills.length === 0) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={22}>
                no records found
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Payment ID</TableCell>
            <TableCell align="right">Bill No</TableCell>
            <TableCell align="right">Entity</TableCell>
            <TableCell align="right">Transaction ID</TableCell>
            <TableCell align="right">Transaction Time</TableCell>
            <TableCell align="right">Transaction Mode</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Remitter</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bills.map(
            (
              {
                entity,
                paymentId,
                property,
                billNo,
                dueDate,
                transactionDate,
                generatedMode,
                amount,
                status,
                transactionId,
                transactionMode,
              }: any,
              index: number
            ) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{paymentId}</TableCell>
                <TableCell align="right">{billNo}</TableCell>
                <TableCell align="right">{entity}</TableCell>
                <TableCell align="right">{transactionId}</TableCell>
                <TableCell align="right">
                  {dayjs(transactionDate).format(DATE_FORMAT)}
                </TableCell>
                <TableCell align="right">{transactionMode}</TableCell>
                <TableCell align="right">{amount}</TableCell>
                <TableCell align="right"> </TableCell>
                <TableCell align="right">{status}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function DueTable({ url }: { url: string }): React.JSX.Element {
  const { data = {}, isLoading, error, mutate } = useSWRImmutable(url);
  const [open, setOpen] = useState(false);
  const [drawerData, setDrawerData] = useState(null);
  const bills = data || [];

  const handleClickOpen = (bill:any ) => {
    setDrawerData(bill);
    setOpen(true);
  };


  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
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
              <TableCell align="center" colSpan={22}>
                Cant fetch Data
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    );
  }
  if (bills.length === 0) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={22}>
                no records found
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    );
  }

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { accessorKey: "bill_no", size: 200, header: "Bill No" },
    { accessorKey: "entity", size: 50, header: "Entity" },
    {
      accessorKey: "bill_date",
      header: "Generated Date",
      size: 100,
      Cell: ({ renderedCellValue }: any) => {
        return dayjs(renderedCellValue).format("DD-MM-YYYY");
      },
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      size: 150,
      Cell: ({ renderedCellValue }: any) => {
        return dayjs(renderedCellValue).format("DD-MM-YYYY");
      },
    },
    { accessorKey: "amount", size: 50, header: "Amount"},
    { accessorKey: "bill_mode", size: 180, header: "Generation Mode" },
    { accessorKey: "status", size: 50, header: "Status" },
    {
      accessorKey: "action",
      size: 200,
      header: "Action",
      Cell: ({ row }: any) => {
        return row.original.status === 'Paid'?'':(
          <Button
            onClick={() => handleClickOpen(row?.original)}
            variant="text"
          >
            Pay Bill
          </Button>
        );
      },
    },
  ];
  return (
    <>
      <MaterialReactTable
        enableColumnActions={false}
        enableColumnFilters={false}
        columns={columns}
        data={bills}
        enableTopToolbar={false}
        enableSorting={false}
      />
      {drawerData?<BillDetailsDrawer
        open={open}
        drawerData={drawerData}
        mutate={mutate}
        onClose={() => setOpen(false)}
      ></BillDetailsDrawer>: ''}
      {/* <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Are you sure you want to submit  ?"}</DialogTitle>

          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              No, Go back
            </Button>
            <Button variant="contained" onClick={() => submitPayments(billNo)}>
              Yes, Submit
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment> */}
    </>
  );
}

function BillDetailsDrawer({ open, onClose, mutate, drawerData }: any) {
  const session = React.useContext(SessionContext)
  const [formData, setFormData] = React.useState({
    paymentReceiptNumber: ''
  });
  const columns = [ 
    { accessorKey: "service_subtype", size: 50, header: "" },
    { accessorKey: "past_reading", size: 50, header: "Past" },
    { accessorKey: "present_reading", size: 50, header: "Present" },
    { accessorKey: "consumption", size: 50, header: "Consumption" },
    { accessorKey: "unit_cost", size: 50, header: "Unit Cost" },
    { accessorKey: "amount", size: 50, header: "Amount" },
    ]
  const handleClose = () => {
    onClose();
  };

  async function submitPayments(billNo: string, data: Record<string, string> = {}) {
    await UPDATE(`/bills/paid/${billNo}`, data);
    mutate();
    onClose();
  }

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const globalTheme = useTheme();
  const tableTheme = createTheme({
    palette: {
      mode: globalTheme.palette.mode, //let's use the same dark/light mode as the global theme
      primary: globalTheme.palette.secondary, //swap in the secondary color as the primary for the table
      info: {
        main: 'rgb(255,122,0)', //add in a custom color for the toolbar alert background stuff
      },
      background: {
        default:
          globalTheme.palette.mode === 'light'
            ? '#EEEBFF'
            : '#000', //pure black table in dark mode for fun
      },
    },
    typography: {
      button: {
        textTransform: 'none', //customize typography styles for all buttons in table by default
        fontSize: '1.2rem',
      },
    }

  });
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Drawer
        open={open}
        anchor="right"
        onClose={handleClose}
        PaperProps={{
          component: "form",
          style: { width: "40%" },
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            submitPayments(drawerData.generated_bill_id, formJson);
          },
        }}
      >
        <div style={{ padding: "10px 20px" }}>
          <h2>Offline Parameters</h2>
          <div>
            <h3>Bill Parameters</h3>

            <div style={{ fontWeight: "600", fontSize: "12px" }}>Bill No</div>
            <div style={{ marginBottom: "12px" }}>{drawerData.bill_no}</div>
            <div style={{ fontWeight: "600", fontSize: "12px" }}>
              Billing Cycle
            </div>
            <div style={{ marginBottom: "12px" }}> {" "}</div>
            <div style={{ display: "flex" }}>
              <div style={{ flexBasis: "50%", marginBottom: "12px" }}>
                <div style={{ fontWeight: "600", fontSize: "12px" }}>
                  Bill Date
                </div>
                <div style={{ fontWeight: "400", fontSize: "14px" }}>
                  {""}
                </div>
              </div>
              <div style={{ flexBasis: "50%" }}>
                <div style={{ fontWeight: "600", fontSize: "12px" }}>
                  Due Date
                </div>
                <div style={{ fontWeight: "400", fontSize: "14px" }}>
                  {""}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "12px" }}>
              <div style={{ flexBasis: "50%" }}>
                <div style={{ fontWeight: "600", fontSize: "12px" }}>
                  Project
                </div>
                <div style={{ fontWeight: "400", fontSize: "14px" }}>
                  {drawerData.project}
                </div>
              </div>
              <div style={{ flexBasis: "50%" }}>
                <div style={{ fontWeight: "600", fontSize: "12px" }}>Group</div>
                <div style={{ fontWeight: "400", fontSize: "14px" }}>
                  {drawerData.group_name}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "12px" }}>
              <div style={{ flexBasis: "50%" }}>
                <div style={{ fontWeight: "600", fontSize: "12px" }}>
                  Entity
                </div>
                <div style={{ fontWeight: "400", fontSize: "14px" }}>
                  {drawerData.entity}
                </div>
              </div>
              <div style={{ flexBasis: "50%" }}>
                <div style={{ fontWeight: "600", fontSize: "12px" }}>
                  Service
                </div>
                <div style={{ fontWeight: "400", fontSize: "14px" }}>
                  {drawerData.service}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: "18px" }}>
              <ThemeProvider theme={tableTheme}>
                <MaterialReactTable
                  enableColumnActions={false}
                  enableColumnFilters={false}
                  columns={columns}
                  data={[drawerData]}
                  enableTopToolbar={false}
                  enableSorting={false}
                  enablePagination={false}
                  enableBottomToolbar={true}
                  renderBottomToolbar={({table}) => {
                    return (
                      <div className="price-summary" style={{paddingLeft: '24px', paddingRight: '32px', paddingTop:'12px', paddingBottom: '12px'}}>
                        <div>Sub Total</div>
                        <div className="price">{drawerData.amount}</div>
                      </div>
                    );
                  }}
                />
              </ThemeProvider>
            </div>
            <div>
              <FormControl fullWidth>
                <TextField
                  name="remarks"
                  id="remarks"
                  placeholder="Payment Receipt Number"
                  variant="outlined"
                  label="Adjustement Remarks"
                  onChange={handleChange}
                />
              </FormControl>
            </div>
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={handleClose}
              style={{ marginRight: "1em" }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Mark as Paid
            </Button>
          </div>
        </div>
      </Drawer>
    </LocalizationProvider>
  );
}
function RechargeTable({ url }: { url: string }): React.JSX.Element {
  const { data = {}, isLoading, error } = useSWRImmutable(url);
  const bills = data.bills || [];
  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
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
              <TableCell align="center" colSpan={22}>
                Cant fetch Data
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    );
  }
  if (bills.length === 0) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={22}>
                no records found
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Payment ID</TableCell>
            <TableCell align="right">Bill No</TableCell>
            <TableCell align="right">Entity</TableCell>
            <TableCell align="right">Transaction ID</TableCell>
            <TableCell align="right">Transaction Time</TableCell>
            <TableCell align="right">Transaction Mode</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Remitter</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bills.map(
            (
              {
                payment,
                property,
                billNo,
                dueDate,
                generatedDate,
                generatedMode,
                amount,
                status,
              }: any,
              index: number
            ) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{billNo}</TableCell>
                <TableCell align="right">{property}</TableCell>
                <TableCell align="right">{amount}</TableCell>
                <TableCell align="right">{generatedDate}</TableCell>
                <TableCell align="right">{dueDate}</TableCell>
                <TableCell align="right">{generatedMode}</TableCell>
                <TableCell align="right">{status}</TableCell>
                <TableCell align="right"> </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
