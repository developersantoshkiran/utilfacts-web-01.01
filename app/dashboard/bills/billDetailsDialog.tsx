"use client";

import * as React from "react";
import { Drawer, Box } from "@mui/material";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import { SessionContext } from "@/app/_providers/sessionProvides";
import { Session } from "@/app/_types/types";
import { GET } from "@/app/utils/api";

const BillDetails = React.memo(({service, open, onClose, rowData = [], total }: any) => {
  const session = React.useContext(SessionContext);
  let firstRow = rowData[0]
  const [derivedRowData, setDerivedRowData] = React.useState(undefined);
  React.useEffect(() => {
    if(firstRow && firstRow?.entity && session?.selectedAdminProject)
    GET(`/users?entity=${firstRow.entity}&group=${firstRow.group_name}`).then((userInfo: any) => {
      setDerivedRowData({ ...firstRow, ...userInfo })
    }).catch(e => console.log(e))
  }, [firstRow?.entity])

  if(!derivedRowData) {
    return <React.Fragment></React.Fragment>
  }
  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box p={2} width='980px'>
        <PDFViewer height={window.innerHeight - 50} width='100%'>
          <MyDocument service={service} rowData= {rowData} data={derivedRowData} total={total} session={session} />
        </PDFViewer>
      </Box>
    </Drawer>
  );
});

BillDetails.displayName = "BillDetails";

export default BillDetails;

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6E5DE7",
  },
  imageStyle: {
    position: "absolute",
    right: 0,
    width: 120,
    height: 40,
  },
  summarySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  billHeader: {
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 600,
    marginBottom: 10,
  },
  table: {
    width: "100%",
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    padding: 5,
    border: "1px solid #ccc",
    textAlign: "center",
    borderLeft: "1px solid #ccc",
    borderBottom: "2px solid #ccc",
  },
  tableColSpan: {
    width: "25%",
    padding: 5,
    textAlign: "right",
    borderTop: "1px solid #ccc",
    borderBottom: "2px solid #ccc",
  },
  tableColSpanLeft: {
    width: "25%",
    padding: 5,
    borderTop: "1px solid #ccc",
    borderLeft: "1px solid #ccc",
    borderBottom: "2px solid #ccc",
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },
  amountDueText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "right",
  },
  textRight: {
    alignItems: "flex-end",
  },
  signatureText: {
    marginTop: 100,
    alignItems: "flex-end",
  },
  footerText: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 30,
    fontSize: 10,
    textAlign: "center",
  },
});

// Create Document Component
const MyDocument = ({ data, session, rowData, total, service}: {service: string, data: any, session: Session, rowData: Array<any>, total: number }) => {
  if (!session || !session.selectedAdminProject) {
    return
  }
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{session.selectedAdminProject.name}</Text>
          <Image style={styles.imageStyle} src='/logoUtilFacts.png'></Image>
        </View>
        <View style={styles.header}>
          <Text style={styles.billHeader}>MONTHLY {(service || '').toUpperCase()} BILL</Text>
        </View>
        {/* Summary */}
        <View style={styles.summarySection}>
          <View>
            <View style={styles.section}>
              <Text>From : {data.from_date ? dayjs(data.from_date).format("DD-MM-YYYY") : ""}</Text>
              <Text>To: {data.to_date ? dayjs(data.to_date).format("DD-MM-YYYY") : ""}</Text>
            </View>
            <View style={styles.section}>
              <Text>
                <Text style={styles.boldText}>Entity: </Text> {data.entity}
              </Text>
            </View>
            <View style={styles.section}>
              <Text>Address: </Text>
              <Text>{session.selectedAdminProject.name}</Text>
              <Text>{session.selectedAdminProject.address1}</Text>
              <Text>{session.selectedAdminProject.address2}, {session.selectedAdminProject.city} </Text>
              <Text>{session.selectedAdminProject.State} -{session.selectedAdminProject.postalCode} </Text>
            </View>
            <View style={styles.section}>
              <Text>
                <Text style={styles.boldText}>Name: </Text> {data.name}
              </Text>
            </View>
            <View style={styles.section}>
              <Text>
                <Text style={styles.boldText}>Mobile: </Text> {data.phoneNumber}
              </Text>
            </View>
            <View style={styles.section}>
              <Text>
                <Text style={styles.boldText}>Email: </Text> {data.email}
              </Text>
            </View>
          </View>

          {/* Amount Payable */}
          <View>
            <View style={styles.section}>
              <View>
                <View style={styles.textRight}>
                  <Text>Bill Number:</Text>
                </View>
                <View style={styles.textRight}>
                  <Text style={styles.amountDueText}>{data.bill_no}</Text>
                </View>
              </View>
              <View>
                <View style={styles.textRight}>
                  <Text>Bill Date:</Text>
                </View>
                <View style={styles.textRight}>
                  <Text style={styles.amountDueText}>
                    {dayjs(data.bill_date).format("DD-MM-YYYY")}
                  </Text>
                </View>
              </View>
              <View>
                <View style={styles.textRight}>
                  <Text>Total Amount Payable:</Text>
                </View>
                <View style={styles.textRight}>
                  <Text style={styles.amountDueText}>Rs {total}</Text>
                </View>
              </View>
              <View style={styles.textRight}>
                <Text>Due Date:</Text>
              </View>
              <View style={styles.textRight}>
                <Text style={styles.amountDueText}>
                  {dayjs(data.due_date).format("DD-MM-YYYY")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Last Bill Summary */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {/* <Text style={[styles.tableCol, styles.tableHeader]}>Last Bill</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>
              Payment Made
            </Text> */}
            <Text style={[styles.tableCol, styles.tableHeader]}>
              Current Charges
            </Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>
              Amount Payable
            </Text>
          </View>
          <View style={styles.tableRow}>
            {/* <Text style={styles.tableCol}>-</Text>
            <Text style={styles.tableCol}>-</Text> */}
            <Text style={styles.tableCol}>Rs {total}</Text>
            <Text style={styles.tableCol}>Rs {total}</Text>
          </View>
        </View>

        {/* Charges Summary */}
        <Text style={styles.boldText}>This Month&apos;s Charges Summary</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableHeader]}>Services</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>
              Past Reading
            </Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>
              Present Reading
            </Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>
              Consumption
            </Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Unit Cost</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Total</Text>
          </View>
          {rowData.map((data, index) => {
            return <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>
                {data.service} - {data.service_subtype}
              </Text>
              <Text style={styles.tableCol}>{data.past_reading}</Text>
              <Text style={styles.tableCol}>{data.present_reading}</Text>
              <Text style={styles.tableCol}>{data.consumption}</Text>
              <Text style={styles.tableCol}>Rs {data.unit_cost}</Text>
              <Text style={styles.tableCol}>Rs {data.amount}</Text>
            </View>
          })}
  
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Adjustments</Text>
            <Text style={styles.tableCol}>-</Text>
            <Text style={styles.tableCol}>-</Text>
            <Text style={styles.tableCol}>-</Text>
            <Text style={styles.tableCol}>-</Text>
            <Text style={styles.tableCol}>-</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColSpanLeft}></Text>
            <Text style={styles.tableColSpan}></Text>
            <Text style={styles.tableColSpan}></Text>
            <Text style={styles.tableColSpan}></Text>
            <Text style={styles.tableColSpan}>Total</Text>
            <Text style={styles.tableCol}>Rs {total}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={{ fontSize: 18, fontWeight: 'extrabold', lineHeight: "1.5" }}>Amount Payable To </Text>
          <Text>A/c Name:{session.selectedAdminProject.accountName}</Text>
          <Text>A/c Number: {session.selectedAdminProject.accountNumber}</Text>
          <Text>IFSC Code: {session.selectedAdminProject.ifscCode}</Text>
          <Text>Branch: {session.selectedAdminProject.branch}</Text>
          <Text>Bank: {session.selectedAdminProject.bank}</Text>
        </View>
        <View style={styles.signatureText}>
          <Text>Authorized Signature</Text>
        </View>
        <View style={styles.footerText}>
          <Text>** This is an electronically generated document **</Text>
        </View>
      </Page>
    </Document>
  );
};
