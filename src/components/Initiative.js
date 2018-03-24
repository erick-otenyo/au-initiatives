import React, { Component } from "react";
import { Container, Header, Grid, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import {
  Layer,
  Feature,
  ZoomControl,
  GeoJSONLayer,
  Popup
} from "react-mapbox-gl";
import geojsonExtent from "@turf/bbox";
import { Map, mapStyle, style } from "./Map";
import Projects from "./Projects";

class ProjectComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { selected: null };
  }
  componentDidMount() {
    const me = this;
    const project_id = this.props.match.params.id;
    let geojson;
    if (project_id) {
      const project = Projects.find(prj => {
        return prj.id === project_id;
      });
      if (project.geom && project.geom.type === "countries") {
        let query;
        let i = true;
        project.geom.list.forEach(country => {
          if (i) {
            query = "name='" + country + "'";
            i = false;
          } else {
            query = query + "OR name='" + country + "'";
          }
        });
        console.log(query);
        const carto = `https://erick-otenyo.carto.com/api/v2/sql?q=SELECT*from africa_countries WHERE (${query})&format=geojson`;
        console.log(carto);
        fetch(carto)
          .then(function(response) {
            return response.json();
          })
          .then(function(geojs) {
            const bounds = geojsonExtent(geojs);

            me.setState({
              project_id: project_id,
              project: project,
              geojson: geojs,
              bounds: [[bounds[0], bounds[1]], [bounds[2], bounds[3]]]
            });
          });
      } else if (project.geom && project.geom.type === "point") {
        const geojsonP = {
          type: "FeatureCollection",
          features: []
        };
        project.geom.list.forEach(pt => {
          geojsonP.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: pt.coordinates
            }
          });
        });
        let bounds;
        if (geojsonP.features.length <= 1) {
          bounds = [[-25.3604, -46.9658], [51.417, 37.3452]];
        } else {
          const extent = geojsonExtent(geojsonP);
          bounds = [[extent[0], extent[1]], [extent[2], extent[3]]];
        }
        me.setState({
          project_id: project_id,
          project: project,
          bounds: bounds
        });
      } else {
        me.setState({
          project_id: project_id,
          project: project
        });
      }
    }
  }
  onMapClick = (map, e) => {
    //hide popup on clicking outside
    if (this.state.selected) {
      this.setState({ selected: null });
    }
  };
  handleFeatureClick = feature => {
    this.setState({ selected: feature });
  };
  onToggleHover(cursor, { map }) {
    //show or hide pointer cursor when hovering a feature on map
    map.getCanvas().style.cursor = cursor;
  }
  render() {
    const { project_id, project, geojson, bounds, selected } = this.state;
    let features;
    if (project) {
      // layer for points
      if (project.geom && project.geom.type === "point") {
        features = (
          <Layer
            type="circle"
            paint={{
              "circle-color": "#fbbd08",
              "circle-radius": 10,
              "circle-stroke-color": "#000",
              "circle-stroke-width": 5
            }}
          >
            {project.geom.list.map(feature => (
              <Feature
                coordinates={feature.coordinates}
                onClick={this.handleFeatureClick.bind(this, feature)}
                onMouseEnter={this.onToggleHover.bind(this, "pointer")}
                onMouseLeave={this.onToggleHover.bind(this, "")}
              />
            ))}
          </Layer>
        );
      } else {
        features = (
          <GeoJSONLayer
            data={geojson}
            fillPaint={{
              "fill-color": "green",
              "fill-outline-color": "#000",
              "fill-opacity": 0.4
            }}
          />
        );
      }
    }
    return (
      <Container>
        <Link to={`${process.env.PUBLIC_URL}/`}>
          <Button basic icon>
            <Icon name="chevron left" />
            Back to Initiatives
          </Button>
        </Link>
        <Grid style={{ marginTop: 20 }}>
          {project && (
            <Grid.Row>
              <Grid.Column width={8}>
                <Header style={{ marginBottom: 40 }}>{project.title}</Header>
                <Header>Objectives</Header>
                <div>
                  <ul>
                    {project.objective.map(challenge => {
                      return (
                        <li key={challenge.substr(challenge.length - 5)}>
                          {challenge}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <Link to={`${process.env.PUBLIC_URL}/`}>
                  <Button basic icon>
                    <Icon name="chevron left" />
                    Back to Initiatives
                  </Button>
                </Link>
              </Grid.Column>
              <Grid.Column width={8}>
                {/* <Header>Project Map here</Header> */}
                <div>
                  <Map
                    style={style}
                    containerStyle={mapStyle}
                    onClick={this.onMapClick.bind(this)}
                    fitBounds={
                      bounds
                        ? bounds
                        : [[-25.3604, -46.9658], [51.417, 37.3452]]
                    }
                    fitBoundsOptions={{
                      padding: 30
                    }}
                    // center={project.coordinates}
                  >
                    <ZoomControl position="bottom-right" />
                    {project.geom &&
                      project.geom.type === "all" && (
                        <GeoJSONLayer
                          data="https://erick-otenyo.carto.com/api/v2/sql?q=SELECT * from africa_countries&format=geojson"
                          fillPaint={{
                            "fill-color": "red",
                            "fill-outline-color": "#000",
                            "fill-opacity": 0.4
                          }}
                        />
                      )}

                    {features}
                    {selected && (
                      <Popup
                        coordinates={selected.coordinates}
                        offset={{
                          "bottom-left": [12, -38],
                          bottom: [0, -10],
                          "bottom-right": [-12, -38]
                        }}
                      >
                        <h3>{selected.name}</h3>
                      </Popup>
                    )}
                  </Map>
                </div>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Container>
    );
  }
}

export default ProjectComponent;
