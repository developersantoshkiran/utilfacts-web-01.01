"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function ManualBillGenDialog() {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    group: "",
    entity: "",
    service: "",
    fromDate: null,
    toDate: null,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    // Handle form submission here
    handleClose();
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string, date: Dayjs | null) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: date,
    }));
  };

  return (
    <React.Fragment>
      <Button variant='outlined' onClick={() => setOpen(true)}>
        Manual Bill Generation
      </Button>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Drawer
          open={open}
          anchor='right'
          onClose={handleClose}
          PaperProps={{
            component: "form",
            style: { width: "25%" },
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              handleClose();
            },
          }}
        >
          <div style={{ padding: "10px 20px" }}>
            <h4>Manual Bill Generation</h4>
            <div>
              <h5>Bill Parameters</h5>
              <div>
                <FormControl fullWidth style={{ marginTop: "20px" }}>
                  <InputLabel id='groupId'>Group</InputLabel>
                  <Select
                    labelId='groupId'
                    label='Group'
                    value={formData.group}
                    name='group'
                    onChange={handleChange}
                  >
                    <MenuItem value='Group A'>Group A</MenuItem>
                    <MenuItem value='Group B'>Group B</MenuItem>
                    <MenuItem value='Group C'>Group C</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth style={{ marginTop: "20px" }}>
                  <InputLabel id='entityId'>Entity</InputLabel>
                  <Select
                    labelId='entityId'
                    label='Entity'
                    value={formData.entity}
                    name='entity'
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value='Entity A'>Entity A</MenuItem>
                    <MenuItem value='Entity B'>Entity B</MenuItem>
                    <MenuItem value='Entity C'>Entity C</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth style={{ marginTop: "20px" }}>
                  <InputLabel id='serviceId'>Service</InputLabel>
                  <Select
                    labelId='serviceId'
                    label='Service'
                    value={formData.service}
                    name='service'
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value='Service A'>Service A</MenuItem>
                    <MenuItem value='Service B'>Service B</MenuItem>
                    <MenuItem value='Service C'>Service C</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth style={{ marginTop: "20px" }}>
                  <DatePicker
                    label='From Date'
                    value={formData.fromDate}
                    name='fromDate'
                    format='DD/MM/YYYY'
                    onChange={(date) => handleDateChange("fromDate", date)}
                  />
                </FormControl>
                <FormControl fullWidth style={{ marginTop: "20px" }}>
                  <DatePicker
                    label='To Date'
                    value={formData.toDate}
                    name='toDate'
                    format='DD/MM/YYYY'
                    onChange={(date) => handleDateChange("toDate", date)}
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
                variant='outlined'
                color='error'
                onClick={handleClose}
                style={{ marginRight: "1em" }}
              >
                Cancel
              </Button>
              <Button type='submit' variant='contained'>
                Continue
              </Button>
            </div>
          </div>
        </Drawer>
      </LocalizationProvider>
    </React.Fragment>
  );
}
