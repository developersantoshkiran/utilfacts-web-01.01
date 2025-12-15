"use client";

import { useState, useEffect } from "react";
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
import ManualBillGenDialog from "./manualBillGenDialog";
import dayjs from "dayjs";
import { FileDownload } from "@mui/icons-material";
import BillDetails from "./billDetailsDialog";
import { ServicesList } from "../page";
import { GET } from "@/app/utils/api";

export default function Page() {

  const { data: servicesData = [], isLoading } = useSWR<ServicesList>(`/dashboard/services`);
  const [selectedValue, setSelectedValue] = useState("");
  React.useEffect(() => {
    if (servicesData && servicesData.length)
      setSelectedValue(servicesData[0]?.service)
  }, [servicesData])
  if (isLoading) {
    return <CircularProgress></CircularProgress>
  }

  if (!selectedValue) {
    return <div></div>
  }
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedValue(newValue);
  };

  const config = servicesData.map(({ service, sub_services }) => {
    return {
      value: service,
      label: service,
      show: true,
      sub_services
    }
  })


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
          <span>Bills</span>
          <ManualBillGenDialog />
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
        {config.map(({ value, show, sub_services }, index) => (
          <TabPanel
            key={index}
            selectedValue={selectedValue}
            show={show}
            value={value}
            sub_services={sub_services}
          >
            { }
          </TabPanel>
        ))}
      </div>
    </>
  );
}

function TabPanel({ selectedValue, value, show, sub_services, ...other }: any) {
  const [status, setstatus] = useState("");
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
      {selectedValue === value && (
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
            <span>All Bills</span>
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
                  <MenuItem value={"Due"}>Due</MenuItem>
                  <MenuItem value={"OverDue"}>OverDue</MenuItem>
                  <MenuItem value={"Deleted"}>Deleted</MenuItem>
                  <MenuItem value={"Paid"}>Paid</MenuItem>
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
                  label='Due Date'
                  value={date}
                  format='DD/MM/YYYY'
                  onChange={(value) => setDate(value as any)}
                />
              </LocalizationProvider>
              <FormControl
                sx={{ minWidth: 120, marginLeft: 3 }}
                variant='filled'
              >
                <InputLabel htmlFor='standard-adornment-amount'>
                  Search By Entity
                </InputLabel>
                <OutlinedInput
                  id='standard-adornment-amount'
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
            sub_services={sub_services}
            service={selectedValue}
            date={date ? dayjs(date).format("YYYY-MM-DD") : null}
          ></TableCom>

        </>
      )}
    </div>
  );
}

function TableCom({
  status: statusFilter,
  show,
  date,
  searchTerm = "",
  sub_services = [],
  service
}: any): React.JSX.Element {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({} as any);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, //customize the default page size
  });
  let subServicesString = (sub_services).map(({ name }: any) => name).join(',')
  const {
    data = [],
    isLoading,
    error,
    mutate
  } = useSWR(
    `/bills?status=${statusFilter}&dueDate=${date}&searchTerm=${searchTerm}&sub_services=${subServicesString}&page=${pagination.pageIndex + 1}`
  );


  function getCellValue({ renderedCellValue, row, cell }: any, key: any) {
    return (renderedCellValue || []).map((obj: any, index: number) => {
      let { service_subtype } = obj
      return <div key={index}>{service_subtype}: {obj[key]}</div>
    })
  }

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
  let bills = show ? data : [];
  let totalRows = (bills[0] || {}).count || 0;
  const columns = [
    {
      accessorFn: ({ results = [] }: any) => `${results[0].bill_no}`,
      id: "bill_no",
      size: 220,
      header: "Bill No",
      muiTableBodyCellProps: ({ cell }: any) => ({
        sx: {
          color: "#6E5DE7",
          fontWeight: "bold",
        },
      }),
    },
    { accessorFn: ({ results = [] }: any) => `${results[0].entity}`, id: "entity", size: 50, header: "Entity" },
    {
      accessorKey:'results',
      id: "from_date",
      header: "Past Reading Date",
      size: 150,
      Cell: ({ renderedCellValue = [] }: any) => {
        let record = renderedCellValue.filter(({from_date}: any) =>from_date)[0];
        return  record
          ? dayjs(record['from_date']).format("DD-MM-YYYY")
          : "";
      },
    },
    {
      accessorKey: `results`,
      id: 'past_reading',
      header: `past reading `,
      size: 150,
      Cell: (options: any) => getCellValue(options, 'past_reading')
    },
    {
      accessorKey: `results`,
      id: 'present_reading',
      size: 50,
      header: `Present Reading `,
      Cell: (options: any) => getCellValue(options, 'present_reading')
    },
    {
      accessorKey: `results`,
      id: 'consumption',
      size: 180,
      header: `Consumption `,
      Cell: (options: any) => getCellValue(options, 'consumption')
    },
    {
      accessorKey: `results`,
      id: 'unit_cost',
      size: 50,
      header: `Unit Cost `,
      Cell: (options: any) => getCellValue(options, 'unit_cost')
    },
    {
      accessorFn: ({ results = [], total_amount }: any) => `${total_amount}`,
      id: "amount",
      size: 100,
      header: "Amount",
    },
    {
      accessorFn: ({ results = [] }: any) => `${results[0].bill_date}`,
      id: "bill_date",
      size: 100,
      header: "Generated Date",
      Cell: ({ renderedCellValue }: any) => {
        return renderedCellValue
          ? dayjs(renderedCellValue).format("DD-MM-YYYY")
          : "";
      },
    },
    {
      accessorFn: ({ results = [] }: any) => `${results[0].due_date}`,
      id: "due_date",
      size: 150,
      header: "Due Date",
      Cell: ({ renderedCellValue }: any) => {
        return renderedCellValue
          ? dayjs(renderedCellValue).format("DD-MM-YYYY")
          : "";
      },
    },
    {
      accessorFn: ({ results = [] }: any) => `${results[0].bill_mode}`,
      id: "bill_mode",
      size: 100,
      header: "Generation Mode",
    },
    {
      accessorFn: ({ results = [] }: any) => `${results[0].status}`,
      id: "status",
      size: 100,
      header: "Status",
    },
  ];

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const handleExportData = () => {
    GET(`/bills?export=${true}&status=${statusFilter}&dueDate=${date}&searchTerm=${searchTerm}&sub_services=${subServicesString}`).then((data: any) => {
      let formattedData = data.map((record: any) => {
        const { due_date, bill_date, to_date, from_date } = record
        record.due_date = due_date ? dayjs(due_date).format('DD-MM-YYYY') : '';
        record.bill_date = bill_date ? dayjs(bill_date).format('DD-MM-YYYY') : "";
        record.to_date = to_date ? dayjs(to_date).format('DD-MM-YYYY') : '';
        record.from_date = from_date ? dayjs(from_date).format('DD-MM-YYYY') : '';
        return record;
      })
      const csv = generateCsv(csvConfig)(formattedData);
      download(csvConfig)(csv);
    })

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
        manualPagination={true}
        muiPaginationProps={{
          rowsPerPageOptions: [5]
        }}
        rowCount={totalRows}
        onPaginationChange={setPagination}
        state={{
          pagination
        }}
        data={bills}
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
            <Button
              variant='contained'
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData}
              startIcon={<FileDownload />}
            >
              Export Data
            </Button>
          </Box>
        )}
      />
      <BillDetails
        open={drawerOpen}
        service={service}
        onClose={handleCloseDrawer}
        rowData={selectedRowData['results']}
        total={selectedRowData['total_amount']}
      />
    </>
  );
}
