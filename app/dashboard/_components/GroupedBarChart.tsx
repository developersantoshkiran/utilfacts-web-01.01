import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { Chart } from "react-google-charts";


export function GroupBarChart({ data, isLoading, colors }: any) {
    if (isLoading) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
        }}><CircularProgress ></CircularProgress></div>
    }

    function generateGraphData(input: any) {
        // Step 1: Collect all unique months
        const monthSet = new Set();
        for (const key in input) {
            input[key].forEach((entry: any) => monthSet.add(entry.shortmonth));
        }
        const months = Array.from(monthSet);

        // Step 2: Initialize data array with headers
        const headers = ['Month', ...Object.keys(input)];
        const data: any = [headers];

        // Step 3: Build month-row mapping
        months.forEach(month => {
            const row = [month];
            for (const key of Object.keys(input)) {
                const entry = input[key].find((e: any) => e.shortmonth === month);
                if (entry && entry.units_consumed) {
                    let unitsConsumed = Number(entry.units_consumed);
                    row.push(unitsConsumed > 0 ? unitsConsumed : 0);
                } else {
                    row.push(0)
                }

            }
            data.push(row);
        });

        // Final output


        return data
    }

    const options = {
        chart: {
            title: "Consumption pattern",
        },
        colors: colors
    };

    let chartData = generateGraphData(data);
    if (chartData.length > 1) {
        return <Chart
            chartType='Bar'
            width='100%'
            height={'100%'}
            data={chartData}
            options={options}
            legendToggle
        />
    }


    return <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    }}>No Data</div>



}