import * as L from 'leaflet';

export class MapUtils {

    static initMap(lat: number, lon: number) {
        const map = L.map('map').setView([lat, lon], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        return map;
    }


    static clearLayers(markers: L.Circle[]): void {
        markers.forEach(marker => marker.remove());
        markers = [];
    }

    static getBoundaryBoxBounds(geoPoints: Array<String>): L.LatLngBounds | null {
        if (!geoPoints || geoPoints.length !== 4) {
            return null;
        }

        return L.latLngBounds([
            [parseFloat(geoPoints.at(0) as string), parseFloat(geoPoints.at(2) as string)],
            [parseFloat(geoPoints.at(1) as string), parseFloat(geoPoints.at(3) as string)]
        ]);
    }


    static createAirQualityMarker(
        map: L.Map,
        lat: number, lon: number,
        color: string
    ): L.Circle {
        const circle = L.circle([lat, lon], {
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            radius: 20000
        }).addTo(map);

        return circle;
    }

    static addLegend(map: L.Map) {

        const legend = new L.Control({ position: 'bottomright' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');

            // Define AQI ranges and labels
            const legendItems = [
                { color: '#00e400', label: 'Good', range: '0-50' },
                { color: '#ffff00', label: 'Moderate', range: '51-100' },
                { color: '#ff7e00', label: 'Unhealthy for Sensitive Groups', range: '101-150' },
                { color: '#ff0000', label: 'Unhealthy', range: '151-200' },
                { color: '#8f3f97', label: 'Very Unhealthy', range: '201-300' },
                { color: '#7e0023', label: 'Hazardous', range: '300+' }
            ];

            // Create legend HTML
            div.innerHTML = '<h4>Air Quality Index</h4>';
            legendItems.forEach(item => {
                div.innerHTML += `
                <div style="margin: 5px 0; display: flex; align-items: center;">
                    <div style="width: 20px; height: 20px; background: ${item.color}; display: inline-block; margin-right: 8px;"></div>
                    <span style="font-size: 14px; color: #333;">${item.label} (${item.range})</span>
                </div>
                `;
            });

            return div;
        };

        legend.addTo(map);
    }

}