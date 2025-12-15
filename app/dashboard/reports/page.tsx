"use client";

import { useState } from "react";
import * as React from "react";
import "dayjs/locale/en-gb";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button } from "@mui/material";
import useSWR from "swr";
import { SessionContext } from "@/app/_providers/sessionProvides";
import { Entities, entity, entityConsumption, EntityServices, Groups, Services } from "@/app/_types/types";
import { GET } from "@/app/utils/api";
import dayjs from "dayjs";
import { MaterialReactTable } from "material-react-table";
import { FileDownload } from "@mui/icons-material";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { date } from "yup";


export default function Page() {
    const [group, setGroup] = useState<string | ''>("");
    const [entity, setEntity] = useState<string | ''>("");
    const [service, setServices] = useState<string | ''>('');
    const [services1, setServices1] = useState<EntityServices & { service: Services } | null>(null)
    const [startdate, setStartDate] = useState(null);
    const [enddate, setEndDate] = useState(null);
    const [consumption, setConsumption] = useState<Array<entityConsumption> | null>(null)
    const session = React.useContext(SessionContext)
    const { data: groups = [], error: grouploading, isLoading: groupIsLoading } = useSWR<Array<Groups>>(`/groups/${session?.selectedAdminProject?.id}`);
    const { data: entities = [], error: entitiesloading, isLoading: entitiesIsLoading } = useSWR<Array<Entities>>(group ? `/entities/${group}` : '');
    const { data: services = [], error, isLoading } = useSWR<Array<{service: string} & { sub_services: Array<{entity_service_id: string}> }>>(entity ? `/dashboard/services?entityId=${entity}` : '');
    const [isloading, setIsloading] = useState(false)

    async function generateReport() {
        setIsloading(true)
        const data = await GET<Array<entityConsumption> | null>(`/consumption/all/${service}?startDate=${startdate?dayjs(startdate).format("YYYY-MM-DD"):""}&endDate=${enddate? dayjs(enddate).format("YYYY-MM-DD"):''}`);
        if (data) {
            setIsloading(false)
            setConsumption(data)
        }
    }



    const columns = [
        {
            accessorKey: "date",
            header: "Time Stamp",
            Cell: ({ renderedCellValue }: any) => {
                return renderedCellValue
                    ? dayjs(renderedCellValue).format("DD-MM-YYYY hh:mm:ss A")
                    : "";
            },
        },
        { accessorKey: "units_consumed", size: 50, header: "units" },

    ];
    const csvConfig = mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true,
    });
    const handleExportData = () => {
        if (!consumption) {
            return
        }
        let formattedData = consumption.map((record: any) => {
            const { date, units_consumed } = record
            record.due_date = date ? dayjs(date).format('DD-MM-YYYY') : '';
            return record;
        })
        const csv = generateCsv(csvConfig)(formattedData);
        download(csvConfig)(csv);
    };
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
                    <span>Reports Data</span>

                </div>

                <div

                    style={{
                        paddingBottom: "16px",
                        display: "flex",
                        fontSize: '16px',
                        fontWeight: 'bold',
                        justifyContent: "space-between",
                    }}
                >
                    <span>Reports Data Parameters</span>

                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '6px'

                }}>
                    <FormControl >
                        <InputLabel id='group'>Group</InputLabel>
                        <Select
                            labelId='group'
                            id='group-select'
                            value={group}
                            label='Group'
                            onChange={(event) => setGroup(event.target.value as string)}

                        >
                            {groups && groups.length ?
                                groups?.map((group) => {
                                    const { name, id } = group;
                                    return <MenuItem key={name} value={id}>{name}</MenuItem>

                                }) : <MenuItem>loading</MenuItem>
                            }

                        </Select>
                    </FormControl>

                    <FormControl >
                        <InputLabel id='entity'>Entity</InputLabel>
                        <Select
                            labelId='entity'
                            id='select-entity'
                            value={entity}
                            label='Entity'
                            onChange={(event) => setEntity(event.target.value as string)}

                        >
                            {entities && entities.length ?
                                entities?.map((en, ind) => {
                                    const { entity, id } = en;
                                    return <MenuItem key={entity} value={id}>{entity}</MenuItem>

                                }) : <MenuItem key={'service eror'}>loading</MenuItem>
                            }
                        </Select>
                    </FormControl>

                    <FormControl >
                        <InputLabel id='service'>Service</InputLabel>
                        <Select
                            labelId='service'
                            id='select-service'
                            value={service}
                            label='Services'
                            onChange={(event) => setServices(event.target.value as string)}

                        >
                            {services && services.length ?
                                services?.map((ser, ind) => {
                                    const { service, sub_services } = ser
                                    return <MenuItem key={ind} value={sub_services.map(({entity_service_id}) => entity_service_id).join(('/'))}>{service}</MenuItem>
                                }) : <MenuItem key={'loading'}>loading</MenuItem>
                            }
                        </Select>
                    </FormControl>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale='en-gb'
                    >
                        <DatePicker
                            slotProps={{
                                field: { clearable: true, onClear: () => setStartDate(null) },
                            }}
                            label='Start Date'
                            value={startdate}
                            format='DD/MM/YYYY'
                            onChange={(value) => setStartDate(value as any)}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale='en-gb'
                    >
                        <DatePicker
                            slotProps={{
                                field: { clearable: true, onClear: () => setEndDate(null) },
                            }}
                            label='End Date'
                            value={enddate}
                            format='DD/MM/YYYY'
                            onChange={(value) => setEndDate(value as any)}
                        />
                    </LocalizationProvider>
                </div>
                <Button style={{ marginTop: '20px', marginBottom: '20px' }} onClick={generateReport} variant="contained">Generate Report</Button>
                <MaterialReactTable
                    enableStickyHeader={true}
                    enableColumnActions={false}
                    enableColumnFilters={false}
                    columns={columns}
                    data={consumption ? consumption : []}
                    initialState={{ pagination: { pageSize: 5, pageIndex: 0 } }}
                    enableSorting={false}
                    renderTopToolbar={({ table }) => (
                        <Box
                            sx={{
                                display: "flex",
                                gap: "16px",
                                paddingTop: "24px",
                                paddingRight: "16px",
                                flexWrap: "wrap",
                                justifyContent: 'flex-end'
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
            </div>
        </>
    );
}




