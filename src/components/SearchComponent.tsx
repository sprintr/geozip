import React from "react";

import rbrush from "geojson-rbush";

import MapComponent from "./MapComponent";

import {
	getFeaturesMap,
	searchNeighbours,
	copyTextToClipboard,
} from "../lib/utils";

import featureCollection from "../featureCollection.json";

const featureMap: Map<string, GeoJSON.Feature<GeoJSON.Point>> = getFeaturesMap(featureCollection as GeoJSON.FeatureCollection);

const treeIndex = rbrush().load(featureCollection as GeoJSON.FeatureCollection);

export default class SearchComponent extends React.Component<{}, {
	radius: number,
	zipCode: string,
	query: GeoJSON.Feature<GeoJSON.Point> | undefined,
	neighbours: GeoJSON.FeatureCollection | undefined,
}> {
	constructor(props: React.PropsWithChildren) {
		super(props);
		this.state = {
			radius: 1,
			zipCode: "",
			query: undefined,
			neighbours: undefined,
		};

		this.handleSearch = this.handleSearch.bind(this);
		this.handleChangeRadius = this.handleChangeRadius.bind(this);
		this.handleChangeZipCode = this.handleChangeZipCode.bind(this);
		this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this);
	}

	handleSearch() {
		// Make sure we have a valid radius.
		const radius = this.state.radius;
		if (!radius || radius < 0 || radius > 30) {
			return null;
		}

		// Make sure we have a valid zip code.
		const zipCode = this.state.zipCode;
		if (!zipCode || !/^[0-9]{5}$/.test(zipCode)) {
			return null;
		}

		// Get the query feature from the map to use its coordinates for searching.
		const query: GeoJSON.Feature<GeoJSON.Point> | undefined = featureMap.get(zipCode);
		if (!query) {
			return null;
		}

		// Search neighbours in the radius around query.
		const neighbours = searchNeighbours(query, radius, treeIndex);

		this.setState({
			query: query,
			neighbours: neighbours,
		});
	}

	handleChangeRadius(e: React.SyntheticEvent) {
		const target = e.target as typeof e.target & { value: string, },
			radius = parseInt(target.value);
		this.setState({
			radius: radius,
		}, () => {
			this.handleSearch();
		});
	}

	handleChangeZipCode(e: React.SyntheticEvent) {
		const target = e.target as typeof e.target & { value: string, },
			zipCode = target.value;
		this.setState({
			zipCode: zipCode,
		}, () => {
			this.handleSearch();
		});
	}

	handleCopyToClipboard(e: React.SyntheticEvent) {
		if (this.state.neighbours) {
			copyTextToClipboard(this.state.neighbours);
		}
	}

	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-4 mb-2">
						<div className="card h-100">
							<div className="card-body">
								<h5 className="card-title mb-4">Find Zip Codes</h5>
								<div className="row">
									<div className="col-md-6 col-sm-12 mb-4">
										<div className="form-group">
											<label htmlFor="inputRadius">Distance (Miles):</label>
											<select
												id="inputRadius"
												className="form-control form-control-sm"
												name="inputRadius"
												value={this.state.radius}
												onChange={this.handleChangeRadius}>
												<option value="1">1</option>
												<option value="2">2</option>
												<option value="3">3</option>
												<option value="5">5</option>
												<option value="7">7</option>
												<option value="10">10</option>
												<option value="15">15</option>
												<option value="20">20</option>
												<option value="25">25</option>
												<option value="30">30</option>
											</select>
										</div>
									</div>
									<div className="col-md-6 col-sm-12 mb-4">
										<div className="form-group">
											<label htmlFor="inputZipCode">Zip Code</label>
											<input
												id="inputZipCode"
												className="form-control form-control-sm"
												type="text"
												name="inputZipCode"
												value={this.state.zipCode}
												onChange={this.handleChangeZipCode} />
										</div>
									</div>
								</div>
								<div className="mb-2 mt-2 overflow-y-auto" style={{ maxHeight: '400px' }}>
									{
										this.state.neighbours?.features?.length !== 0
											? <ul className="list-group">
												{
													this.state?.neighbours?.features?.map((feature, i) => {
														return (
															<li key={i} className="list-group-item">{feature?.properties?.zipCode}</li>
														);
													})
												}
											</ul>
											: null
									}
								</div>
							</div>
							<div className="card-footer">
								<button className="btn btn-sm btn-secondary w-100" onClick={this.handleCopyToClipboard}>Copy Zip Codes to Clipboard</button>
							</div>
						</div>
					</div>
					<div className="col-md-8 mb-2">
						<div className="card h-100">
							<div className="card-body">
								<MapComponent
									radius={this.state.radius}
									query={this.state.query}
									neighbours={this.state.neighbours} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
