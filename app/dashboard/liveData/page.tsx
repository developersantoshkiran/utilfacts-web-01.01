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
import { Button } from "@mui/material";
import useSWR from "swr";
import { SessionContext } from "@/app/_providers/sessionProvides";
import { Entities, entity, entityConsumption, EntityServices, Groups, Services } from "@/app/_types/types";
import { GET } from "@/app/utils/api";
import dayjs from "dayjs";

type Consumption = Array<entityConsumption & {entityService: EntityServices & {service: Services}}>
export default function Page() {
  const [group, setGroup] = useState<string | ''>("");
  const [entity, setEntity] = useState<string | ''>("");
  const [service, setServices] = useState<string | ''>('');
  const [services1, setServices1] = useState<EntityServices & { service: Services } | null>(null)
  const [consumption, setConsumption] = useState<Consumption | null>(null)
  const session = React.useContext(SessionContext)
  const { data: groups = [], error: groupError, isLoading: groupIsLoading } = useSWR<Array<Groups>>(`/groups/${session?.selectedAdminProject?.id}`);
  const { data: entities = [], error: entitiesError, isLoading: entitiesIsLoading } = useSWR<Array<Entities>>(group ? `/entities/${group}` : '');
  const { data: services = [], error, isLoading } = useSWR<Array<{ service: string } & { sub_services: Array<{ entity_service_id: string }> }>>(entity ? `/dashboard/services?entityId=${entity}` : '');
  const [isloading, setIsloading] = useState(false)
  async function fetchLiveData() {
    setIsloading(true)
    const data = await GET<Consumption | null>(`/consumption/${service}`);
    if (data) {
      setIsloading(false)
      setConsumption(data)
    }
  }
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
          <span>Live Data</span>

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
          <span>Live Data Parameters</span>

        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <FormControl sx={{ minWidth: 120, width: '100%', marginRight: 3 }}>
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
          <FormControl sx={{ minWidth: 120, width: '100%', marginRight: 3 }}>
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

          <FormControl sx={{ minWidth: 120, width: '100%', marginRight: 3 }}>
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
                  return <MenuItem key={ind} value={sub_services.map(({ entity_service_id }) => entity_service_id).join(('/'))}>{service}</MenuItem>
                }) : <MenuItem key={'loading'}>loading</MenuItem>
              }
            </Select>
          </FormControl>

        </div>
        <Button style={{ marginTop: '20px' }} onClick={fetchLiveData} variant="contained">Fetch Live Data</Button>

        {consumption && !isloading ? <div style={{
          background: "linear-gradient(269.39deg, #FF5757 49.47%, #FF6C6C 95.75%)",
          borderRadius: '20px',
          width: '50%',
          display: 'flex',
          minHeight: '200px',
          marginTop: '20px',
          color: 'white',
          fontSize: '20px',
          paddingLeft: '20px',
          paddingTop: '20px'

        }}>
          <div >
            {
             consumption && consumption.map(({units_consumed, entityService: {service: {subService, unit}, parameter_name}}) => {
                return     <><div>{subService}</div>
            <div style={{ fontWeight: 'bold' }}>{units_consumed} {unit}</div></>
              })
            }
        
            <div>Last synced at: {consumption[0] && consumption[0].date ? dayjs(consumption[0].createdAt).format('DD-MM-YYYY hh a') : ''}</div>
          </div>
        </div>
          : ""}
      </div>
    </>
  );
}




