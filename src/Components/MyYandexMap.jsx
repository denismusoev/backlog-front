import React from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';

const MyYandexMap = ({ data }) => {
    //console.log(data); // Для отладки: проверьте вывод данных в консоль.
    const getMapCenter = (data) => {
        let totalLat = 0;
        let totalLon = 0;
        data.forEach(item => {
            totalLat += parseFloat(item.storeNestedDTO.address.latitude);
            totalLon += parseFloat(item.storeNestedDTO.address.longitude);
        });
        return [totalLat / data.length, totalLon / data.length];
    };

    const center = getMapCenter(data);
    return (
        <YMaps query={{ apikey: '09a76de6-b926-497a-a0b6-bfb200a7e3d7' }}>
            <Map defaultState={{ center: center, zoom: 9 }} style={{ width: '100%', height: '600px'}}>
                {data.map((item, index) => {
                    // Извлекаем строки широты и долготы
                    const { latitude, longitude } = item.storeNestedDTO.address;

                    // Преобразуем строки в числа с плавающей точкой
                    const lat = parseFloat(latitude);
                    const lon = parseFloat(longitude);

                    if (isNaN(lat) || isNaN(lon)) {
                        console.error(`Invalid coordinates for item at index ${index}:`, item);
                        return null; // Пропускаем места без корректных координат
                    }
                    console.log(`lat ${lat} lon ${lon}`)

                    return (
                        <Placemark
                            key={item.id}
                            geometry={[lat, lon]}
                            properties={{
                                hintContent: `Нажмите для информации о ${item.name}`, // Подсказка при наведении
                                balloonContent: `
                                    <strong>${item.name}</strong><br />
                                    Адрес: ${item.storeNestedDTO.address.street}, ${item.storeNestedDTO.address.city}<br />
                                    Количество: ${item.quantity}` // Содержимое всплывающего окна
                            }}
                            modules={['geoObject.addon.balloon', 'geoObject.addon.hint']} // Модули для включения всплывающих окон и подсказок
                        />
                    );
                })}
            </Map>
        </YMaps>
    );
};

export default MyYandexMap;
