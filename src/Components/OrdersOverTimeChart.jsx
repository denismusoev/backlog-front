import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const aggregateOrdersByMonth = (orders, startYear, endYear) => {
    const ordersByMonth = {};

    // Инициализация всех месяцев с нулевым количеством заказов
    for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
            const key = `${year}-${month.toString().padStart(2, '0')}`;  // формат 'YYYY-MM'
            ordersByMonth[key] = 0;
        }
    }

    // Считаем заказы по месяцам
    orders.forEach(order => {
        const month = order.creationDate.substring(0, 7);  // 'YYYY-MM'
        if (ordersByMonth.hasOwnProperty(month)) {
            ordersByMonth[month] += 1;
        }
    });

    return Object.keys(ordersByMonth).map(month => ({
        date: month, // Изменено имя ключа на 'date' для согласованности
        orders: ordersByMonth[month]
    })).sort((a, b) => a.date.localeCompare(b.date)); // Сортировка по месяцам
};

const OrdersOverTimeChart = ({ orders }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const currentYear = new Date().getFullYear(); // или укажите конкретные года, если нужно
        setData(aggregateOrdersByMonth(orders, currentYear, currentYear));
    }, [orders]);

    // Функция для получения названия месяца по 'YYYY-MM'
    const getMonthName = (dateStr) => {
        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель',
            'Май', 'Июнь', 'Июль', 'Август',
            'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        const [, month] = dateStr.split('-');
        return months[parseInt(month, 10) - 1];
    };

    return (
        <div style={{ width: '100%', height: 300 }} className="mb-5">
            <h3><FontAwesomeIcon icon={faChartLine} /> Динамика заказов</h3>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={getMonthName} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders" name="Заказы" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrdersOverTimeChart;
