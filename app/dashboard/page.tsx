"use client";

import styles from "./page.module.scss";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Edit, InfoOutlined } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import useSWR from "swr";
import PopOver from "./_components/popOver"
import { CircularProgress, colors } from "@mui/material";
import { GroupBarChart } from "./_components/GroupedBarChart";
import { Span } from "next/dist/trace";


export type Service = {
  service: string;
  sub_services: Array<SubService>
}
export type ServicesList = Array<Service>;
export type SubService = {
  name: string;
  id: string;
  unit: string;
  color?: string;
  paymentType?: string;
}

export type Readings = {
  shortmonth: string;
  units_consumed: string;
}
export type ReadingsList = {
  [key: string]: Array<Readings>;
}
export type onSubserviceData = (data: ReadingsList) => void;
export default function Page() {


  const { data: devicesData } = useSWR<{
    devices: number;
    configured_dcus: number;
    active_dcus: number;
    service_data: Array<{
      downentities: Array<string>;
      active_services: number;
      configured_services: number;
      entities: Array<string>
      service: number;
    }>
  }>(`/dashboard/devices`);

  const { data: servicesData = [], isLoading } = useSWR<ServicesList>(`/dashboard/services`);


  if (isLoading) {
    return <CircularProgress></CircularProgress>
  }

  const devicesServiceData = devicesData?.service_data || [];
  let labelStyles = {
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontSize: "16px",
    lineHeight: "100%",
    letterSpacing: "1.6%",
    paddingBottom: '8px',
    color: "#333333"

  }

  let valueStyles = {
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: "24px",
    lineHeight: "100%",
    letterSpacing: "1.6%",
  }

  let valueStyles1 = {
    ...valueStyles,
    fontSize: "18px",
    lineHeight: "30px",
  }
  let edgeServerConfigured = 1;
  let edgeServersActive = 1;
  let defaultersCount = 0;
  let defaultersAmount = 0;
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div className='app_title'>Dashboard</div>
        {/* <Image src="/nofificationIcon.svg"  width='48' height="48" alt='Notification Icon'></Image> */}
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "24px" }}
      >
        <div>
          <div
            className={styles.dashboard_title}
            style={{ paddingBottom: "24px" }}
          >
            Metrics
          </div>
          {servicesData.map(({ sub_services, service }, index) => {
            return <MetricsCard sub_services={sub_services} key={index} service={service}></MetricsCard>
          })}

        </div>
        <div>
          <div
            className={styles.dashboard_title}
            style={{ paddingBottom: "24px" }}
          >
            Defaulters
          </div>
          <div
            className={styles.dashboard_metrics}
            style={{ marginBottom: "12px" }}
          >
            <div style={labelStyles}>
              Defaulters Count
              {/* <InfoOutlined></InfoOutlined> */}
            </div>
            <div style={{
              ...valueStyles1, color: (defaultersCount || defaultersAmount) ? "#D40505" : '#0B8954'
            }}>{defaultersCount}</div>
            <div style={{
              ...valueStyles1, color: (defaultersCount || defaultersAmount) ? "#D40505" : '#0B8954'
            }}>₹ {defaultersAmount}</div>
          </div>

          <div
            className={styles.dashboard_title}
            style={{ paddingBottom: "24px" }}
          >
            Devices
          </div>
          <div
            className={styles.dashboard_metrics}
            style={{ marginBottom: "12px" }}
          >

            <div style={{ paddingTop: "12px", paddingBottom: '12px' }}>
              <div style={labelStyles}>
                Devices
                {/* <InfoOutlined></InfoOutlined> */}
              </div>
              <div style={valueStyles}>{devicesData ? devicesData.devices : ""}</div>
            </div>
            <Divider />


            {devicesServiceData.map(({ service, configured_services, active_services, downentities=[] }, index) => {
              return <div key={index}><div style={{ paddingTop: "12px", paddingBottom: '12px' }}>

                <div style={labelStyles}>
                  {service}
                  {/* <InfoOutlined></InfoOutlined> */}
                </div>
                <div style={{
                  ...valueStyles1, color: Number(active_services) !== Number(configured_services) ? "#D40505" : '#0B8954'
                }}>
                 
                  <PopOver label={active_services || 0}  popOverContent={<div>{(downentities || []).map((entity, index) => <div key={index}>{entity}</div>)}</div>}></PopOver>
                  /{configured_services} up</div>

              </div>
                {index !== devicesServiceData.length - 1 ? <Divider /> : <></>}
              </div>
            })}


          </div>

          <div
            className={styles.dashboard_metrics}
            style={{ marginBottom: "12px" }}
          >
            <div style={labelStyles}>
              DCUs
              {/* <InfoOutlined></InfoOutlined> */}
            </div>
            <div style={{
              ...valueStyles1, color: Number(devicesData?.active_dcus) !== Number(devicesData?.configured_dcus) ? "#D40505" : '#0B8954'
            }}>
              {devicesData?.active_dcus || 0}/{devicesData?.configured_dcus || 0} up
            </div>
          </div>

          <div
            className={styles.dashboard_metrics}
            style={{ marginBottom: "12px", }}
          >
            <div>
              Edge Server
              {/* <InfoOutlined></InfoOutlined> */}
            </div>
            <div style={{
              ...valueStyles1, color: Number(edgeServersActive) !== Number(edgeServerConfigured) ? "#D40505" : '#0B8954'
            }}>{edgeServersActive} /{edgeServerConfigured} up</div>
          </div>
        </div>
      </div>
    </>
  );
}


function MetricsCard({ service, sub_services }: Service) {
  let [data, setData] = useState({});
  let [showLoadingOnGraph, setShowLoadingOngraph] = useState(true)
  const counter = useRef(0);

  function onSubserviceData(deviceData: ReadingsList) {
    setData((prevData) => {
      counter.current = counter.current + 1;
      if (counter.current === sub_services.length) {
        setShowLoadingOngraph(false)
      }
      return {
        ...prevData,
        ...deviceData
      }
    })
  }

  let paymentTypes = new Set(sub_services.map(({ paymentType }) => paymentType));
  let paymentTypeCardStyles = {
    width: 80,
    height: 28,
    gap: '2px',
    borderRadius: '15px',
    paddingTop: '3px',
    paddingRight: '12px',
    paddingBottom: '3px',
    paddingLeft: '12px',
    color: "#CD1010",
    backgroundColor: "#FFDEDE"
  }

  return <>
    {

      <div
        className={styles.dashboard_metrics}
        style={{ marginBottom: "24px" }}
      >
        <span
          className={styles.dashboard_title}
          style={{ paddingRight: "24px" }}
        >
          {service}
        </span>
        <span style={paymentTypeCardStyles}>{paymentTypes}</span>
        {/* <span className={styles.dashboard_payment_type_badge}>prepaid</span> */}
        <div
          style={{
            marginTop: "12px",
            display: "grid",
            gridTemplateColumns: "2fr 4fr",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                paddingTop: "24px",
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "12px",
              }}
            >
              <span className={styles.dashboard_received}>Received</span>
              <Edit className={styles.dashboard_received}></Edit>
            </div>
            <div
              style={{
                display: "grid",
                gap: "12px",
                gridTemplateColumns: "1fr 1fr",
                marginBottom: "24px",
              }}
            >
              {sub_services.map(({ name, id, unit }, index) => {
                return <div
                  key={index}
                  style={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: "4px",
                    padding: "12px",
                  }}
                >
                  <div className={styles.dashboard_meter_title}>{name}</div>
                  <div className={styles.dashboard_meter_reading}>0{unit}</div>
                </div>
              })}

            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "12px",
              }}
            >
              <span className={styles.dashboard_received}>Consumed</span>
              {/* <Edit className={styles.dashboard_received}></Edit> */}
            </div>
            <div
              style={{
                display: "grid",
                gap: "12px",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              {sub_services.map(({ name, id, unit, color }, index) => {
                return <SubService name={name} unit={unit} key={index} color={color} id={id} onSubserviceData={onSubserviceData} ></SubService>;
              })}
            </div>
          </div>

          <div
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: "4px",
              padding: "12px",
            }}
          >
            <GroupBarChart colors={sub_services.map(({ color }) => color)} data={data} isLoading={showLoadingOnGraph} sub_services={sub_services}></GroupBarChart>
          </div>
        </div>
      </div>

    }

  </>
}

function SubService({ name, id, unit, onSubserviceData }: (SubService & { onSubserviceData: onSubserviceData })) {
  const { data = [], isLoading, error } = useSWR<
    Array<Readings>
  >(`/dashboard?service_id=${id}&subService=${name}`);

  let latestData = data.at(-1);

  useEffect(() => {
    if (!isLoading)
      onSubserviceData({
        [name]: data
      })


  }, [isLoading])



  return <div
    style={{
      backgroundColor: "#f9f9f9",
      borderRadius: "4px",
      padding: "12px",
    }}
  >
    <div className={styles.dashboard_meter_title}>{name}</div>
    {!isLoading ? <div className={styles.dashboard_meter_reading}>{Number(latestData?.units_consumed) > 0 ? latestData?.units_consumed : 0}{unit}</div> : <CircularProgress size={'16px'} style={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}></CircularProgress>}
  </div>

}



