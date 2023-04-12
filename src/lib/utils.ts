import type { RBush } from "geojson-rbush";

import * as turf from "@turf/turf";

/**
 * Creates a map of zipCode to Feature item
 *
 * @see https://rdrr.io/cran/geoops/man/Feature.html
 * @param featureCollection
 * @returns
 */
export const getFeaturesMap = (featureCollection: GeoJSON.FeatureCollection): Map<string, GeoJSON.Feature<GeoJSON.Point>> => {
	const featuresMap: Map<string, GeoJSON.Feature<GeoJSON.Point>> = new Map();
	featureCollection.features.forEach((feature) => {
		featuresMap.set(feature?.properties?.zipCode, feature as GeoJSON.Feature<GeoJSON.Point>);
	});
	return featuresMap;
}

/**
 * Takes the query feature and radius. Returns all the neighbours in that radius
 *
 * @param query
 * @param radius
 * @param treeIndex
 * @returns
 */
export const searchNeighbours = (
	query: GeoJSON.Feature<GeoJSON.Point>,
	radius: number,
	treeIndex: RBush<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
): GeoJSON.FeatureCollection => {
	if (!query || !radius || !treeIndex) {
		return {
			type: 'FeatureCollection',
			features: [],
		};
	}
	const neighbours = treeIndex.search(turf.circle(query, radius, 0, 'miles'));
	neighbours.features = neighbours.features.filter(feature => {
		return feature?.properties?.zipCode !== query?.properties?.zipCode;
	});
	return neighbours;
}

/**
 * Copies the zip codes in the featureCollection to the clipboard
 *
 * @param featureCollection
 * @returns
 */
export const copyTextToClipboard = async (featureCollection: GeoJSON.FeatureCollection): Promise<void> => {
	const text = featureCollection.features.map((feature) => {
		return feature?.properties?.zipCode;
	}).join(', ');
	return await navigator.clipboard.writeText(text);
};
