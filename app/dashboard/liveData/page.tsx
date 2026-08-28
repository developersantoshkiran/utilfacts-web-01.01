"use client";

import { useState, useContext } from "react";
import * as React from "react";
import "dayjs/locale/en-gb";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";
import useSWR from "swr";
import { SessionContext } from "@/app/_providers/sessionProvides";
import { Entities, entityConsumption, EntityServices, Groups, Services } from "@/app/_types/types";
import { GET } from "@/app/utils/api";
import dayjs from "dayjs";

interface ExtendedEntityService extends EntityServices {
  service: Services;
}

interface ExtendedConsumptionItem extends entityConsumption {
  entityService: ExtendedEntityService;
}

type Consumption = ExtendedConsumptionItem[];

export default function Page() {
  const [group, setGroup] = useState<string | "">("");
  const [entity, setEntity] = useState<string | "">("");
  const [service, setServices] = useState<string | "">("");
  const [consumption, setConsumption] = useState<Consumption | null>(null);
  const session = useContext(SessionContext);
  
  const { data: groups = [] } = useSWR<Groups[]>(
    session?.selectedAdminProject?.id ? `/groups/${session.selectedAdminProject.id}` : null
  );
  
  const { data: entities = [] } = useSWR<Entities[]>(
    group ? `/entities/${group}` : null
  );
  
  const { data: services = [] } = useSWR<any[]>(
    entity ? `/dashboard/services?entityId=${entity}` : null
  );
  
  const [isloading, setIsloading] = useState(false);

  async function fetchLiveData() {
    setIsloading(true);
    try {
      const data = await GET<Consumption | null>(`/consumption/${service}`);
      if (data) {
        setConsumption(data);
      }
    } catch (err) {
      console.error("Failed to fetch live data:", err);
    } finally {
      setIsloading(false);
    }
  }

  const renderGroupItems = () => {
    if (groups && groups.length) {
      return groups.map((g) => (
        <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
      ));
    }
    return <MenuItem value="">loading</MenuItem>;
  };

  const renderEntityItems = () => {
    if (entities && entities.length) {
      return entities.map((en) => (
        <MenuItem key={en.id} value={en.id}>{en.entity}</MenuItem>
      ));
    }
    return <MenuItem value="">loading</MenuItem>;
  };

  const renderServiceItems = () => {
    if (services && services.length) {
      return services.map((ser, ind) => {
        const sub_services = ser.sub_services || [];
        const joinedIds = sub_services.map((s: any) => s.entity_service_id).join("/");
        return (
          <MenuItem key={ind} value={joinedIds}>
            {ser.service}
          </MenuItem>
        );
      });
    }
    return <MenuItem value="">loading</MenuItem>;
  };

  const renderConsumptionCard = () => {
    if (!consumption || isloading) return null;

    return (
      <div style={{
        background: "linear-gradient(269.39deg, #FF5757 49.47%, #FF6C6C 95.75%)",
        borderRadius: "20px",
        width: "50%",
        display: "flex",
        minHeight: "200px",
        marginTop: "20px",
        color: "white",
        fontSize: "20px",
        paddingLeft: "20px",
        paddingTop: "20px"
      }}>
        <div>
          {consumption.map((item: ExtendedConsumptionItem, ind: number) => {
            if (!item || !item.entityService || !item.entityService.service) {
              return null; 
            }
            
            const units = item.units_consumed ?? 0;
            const subService = item.entityService.service.subService || "Unknown";
            const unit = item.entityService.service.unit || "";
            
            return (
              <div key={item.id || ind} style={{ marginBottom: "12px" }}>
                <div>{subService}</div>
                <div style={{ fontWeight: "bold" }}>{units} {unit}</div>
              </div>
            );
          })}
      
          <div style={{ marginTop: "16px", fontSize: "14px", opacity: 0.9 }}>
            Last synced at: {consumption && (consumption as any).createdAt 
              ? dayjs((consumption as any).createdAt).format("DD-MM-YYYY hh:mm a") 
              : "N/A"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        className="app_title"
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
          fontSize: "16px",
          fontWeight: "bold",
          justifyContent: "space-between",
        }}
      >
        <span>Live Data Parameters</span>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <FormControl sx={{ minWidth: 120, width: "100%", marginRight: 3 }}>
          <InputLabel id="group">Group</InputLabel>
          <Select
            labelId="group"
            id="group-select"
            value={group}
            label="Group"
            onChange={(event) => setGroup(event.target.value as string)}
          >
            {renderGroupItems()}
          </Select>
        </FormControl>
        
        {/* FIX: Restored the complete InputLabel and Select components */}
        <FormControl sx={{ minWidth: 120, width: "100%", marginRight: 3 }}>
          <InputLabel id="entity">Entity</InputLabel>
          <Select labelId="entity"
          id="select-entity"
          value={entity}
          label="Entity"
          onChange={(event) => setEntity(event.target.value as string)}
          >
            {renderEntityItems()}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120, width: "100%", marginRight: 3 }}>
          <InputLabel id="service">Service</InputLabel>
          <Select
            labelId="service"
            id="select-service"
            value={service}
            label="Services"
            onChange={(event) => setServices(event.target.value as string)}
          >
            {renderServiceItems()}
          </Select>
        </FormControl>
      </div>
      
      <Button style={{ marginTop: "20px" }} onClick={fetchLiveData} variant="contained">
        Fetch Live Data
      </Button>

      {renderConsumptionCard()}
    </div>
  );
}
