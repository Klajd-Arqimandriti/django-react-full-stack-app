import { DollarCircleOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import moment from 'moment';

import api from "../api";

import { downloadExcel, downloadPDF } from "../utils";

import '../styles/Dashboard.css';

const { RangePicker } = DatePicker;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const salesURL = '/api/getSales/';
const entriesURL = '/api/getEntries/';
const reservationsURL = '/api/getReservations/';

function Dashboard() {
    const [entries, setEntries] = useState(0);
    const [sales, setSales] = useState(0);
    const [reservations, setReservations] = useState(0);

    const [startDate, setStartDate] = useState(moment().subtract(7, 'days')); // Default to the last 7 days
    const [endDate, setEndDate] = useState(moment()); // Default to today

    const fetchDashboardData = (start, end) => {
        const formattedStartDate = start.format('YYYY-MM-DD');
        const formattedEndDate = end.format('YYYY-MM-DD');

        // api.get(`${entriesURL}${formattedStartDate}/${formattedEndDate}/`).then((res) => {
        //     setEntries(res.data.length);
        // });

        api.get(`${salesURL}${formattedStartDate}/${formattedEndDate}/`).then((res) => {
            setSales(res.data.length);
        });

        api.get(`${reservationsURL}${formattedStartDate}/${formattedEndDate}/`).then((res) => {
            setReservations(res.data.length);
        });
    };

    useEffect(() => {
        fetchDashboardData(startDate, endDate)    
    }, [startDate, endDate]);

    const handleDateChange = (dates) => {
        if (dates) {
            setStartDate(dates[0]);
            setEndDate(dates[1]);
        }
    };

    return (
        <Space size={20} direction="vertical">
            <Typography.Title level={4}>Dashboard</Typography.Title>
            <RangePicker
                defaultValue={[startDate, endDate]}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
            />
            <Space direction="horizontal">
                <DashboardCard
                    icon={
                        <ShoppingOutlined
                            style={{
                                color: "blue",
                                backgroundColor: "rgba(0,0,255,0.25)",
                                borderRadius: 20,
                                fontSize: 24,
                                padding: 8,
                            }}
                        />
                    }
                    title={"Entries"}
                    value={entries}
                />
                <DashboardCard
                    icon={
                        <UserOutlined
                            style={{
                                color: "purple",
                                backgroundColor: "rgba(0,255,255,0.25)",
                                borderRadius: 20,
                                fontSize: 24,
                                padding: 8,
                            }}
                        />
                    }
                    title={"Reservations"}
                    value={reservations}
                />
                <DashboardCard
                    icon={
                        <DollarCircleOutlined
                            style={{
                                color: "red",
                                backgroundColor: "rgba(255,0,0,0.25)",
                                borderRadius: 20,
                                fontSize: 24,
                                padding: 8,
                            }}
                        />
                    }
                    title={"Sales"}
                    value={sales}
                />
            </Space>
            <Space>
                {/* <DashboardChart startDate={startDate} endDate={endDate} dataURL={entriesURL} dataLabel="Entries"/> */}
                <DashboardChart startDate={startDate} endDate={endDate} dataURL={salesURL} dataLabel="Sales"/>
                <DashboardChart startDate={startDate} endDate={endDate} dataURL={reservationsURL} dataLabel="Reservations"/>
            </Space>
        </Space>
    );
}

function DashboardCard({ title, value, icon }) {
    return (
        <Card>
            <Space direction="horizontal">
                {icon}
                <Statistic title={title} value={value} />
            </Space>
        </Card>
    );
}

function DashboardChart({ startDate, endDate, dataURL, dataLabel }) {
    const [data, setData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        const formattedStartDate = startDate.format('YYYY-MM-DD');
        const formattedEndDate = endDate.format('YYYY-MM-DD');

        api.get(`${dataURL}${formattedStartDate}/${formattedEndDate}/`).then((response) => {
            const labels = response.data.map(( element ) => {
                return `${element.transaction_datetime.split('T')[0]}`;
            });

            const data = response.data.map(( element ) => {
                return element.tire_amount;
            });

            const dataSource = {
                labels,
                datasets: [
                    {
                        label: dataLabel,
                        data: data,
                        backgroundColor: "rgba(0, 255, 0, 1)",
                    },
                ],
            };

            setData(dataSource);
        });
    }, [startDate, endDate]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: dataLabel,
            },
        },
    };

    return (
        <Card style={{ width: 500, height: 250 }}>
            <Bar options={options} data={data} />
            <div className="buttonsArea">
                <button className="excel-button greyed-out-button" onClick={downloadExcel} disabled>Download Excel</button>
                <button className="pdf-button greyed-out-button" onClick={downloadPDF} disabled>Download PDF</button>
            </div>
        </Card>
    );
}

export default Dashboard;
