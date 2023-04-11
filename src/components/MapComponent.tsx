import {
	FC,
	useEffect,
} from "react";
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	LayerGroup,
	Circle,
	useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const zoomLevelsMap: Record<number, number> = {
	0: 4,
	1: 14,
	2: 13,
	3: 12.2,
	5: 11.6,
	7: 11,
	10: 11,
	15: 10,
	20: 10,
	25: 9.4,
	30: 9,
};

const FlyMeToTheMoon: FC<{
	zoom: number,
	center: {
		lat: number,
		lng: number,
	},
}> = ({ center, zoom }) => {
	const map = useMap();
	useEffect(() => {
		if (map) {
			map.flyTo([center.lat, center.lng], zoom, {
				animate: true,
			});
		}
	}, [center, zoom]);
	return null;
};

const MapComponent: FC<{
	radius: number,
	query: GeoJSON.Feature<GeoJSON.Point> | undefined,
	neighbours: GeoJSON.FeatureCollection | undefined,
}> = ({ radius, query, neighbours }): JSX.Element => {
	let center = { lat: 39.8282, lng: -98.5795, },
		zoom = zoomLevelsMap[0];
	if (query?.geometry?.coordinates[0] &&
		query?.geometry?.coordinates[1]) {
		center = {
			lat: query?.geometry?.coordinates[1],
			lng: query?.geometry?.coordinates[0],
		};
		zoom = zoomLevelsMap[radius];
	}

	return (
		<MapContainer
			center={center}
			zoom={zoom}
			scrollWheelZoom={true}
			style={{ height: 600 }}>
			<FlyMeToTheMoon
				center={center}
				zoom={zoom} />
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<LayerGroup>
				{ // Home
					radius && query?.properties?.zipCode
						? <>
							<Circle
								center={center}
								pathOptions={{
									color: 'red',
									fillColor: 'red',
									stroke: true
								}}
								radius={radius * 1609.34} />
							<Marker position={center}>
								<Popup autoClose={false}>
									{query.properties.zipCode}
								</Popup>
							</Marker>
						</>
						: null
				}
			</LayerGroup>
			<LayerGroup>
				{ // Neighbours
					neighbours?.features && neighbours.features.length !== 0
						? neighbours.features.map((feature, i) => {
							const point = feature as GeoJSON.Feature<GeoJSON.Point>;
							return (
								<Marker key={i} position={{ lat: point.geometry.coordinates[1], lng: point.geometry.coordinates[0] }}>
									<Popup autoClose={false}>
										{point?.properties?.zipCode}
									</Popup>
								</Marker>
							);
						})
						: null
				}
			</LayerGroup>
		</MapContainer>
	);
}
export default MapComponent;
