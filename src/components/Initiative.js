import React, { Component } from "react";
import { Container, Header, Grid, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Layer, Feature, ZoomControl, GeoJSONLayer } from "react-mapbox-gl";
import geojsonExtent from "@turf/bbox";
import { Map, mapStyle, style } from "./Map";
import Projects from "./Projects";

class ProjectComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
              coordinates: pt
            }
          });
        });
        const bounds = geojsonExtent(geojsonP);
        me.setState({
          project_id: project_id,
          project: project,
          bounds: [[bounds[0], bounds[1]], [bounds[2], bounds[3]]]
        });
      } else {
        me.setState({
          project_id: project_id,
          project: project
        });
      }
    }
  }
  render() {
    const { project_id, project, geojson, bounds } = this.state;
    console.log(bounds);
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
              <Feature coordinates={feature} />
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
              </Grid.Column>
              <Grid.Column width={8}>
                {/* <Header>Project Map here</Header> */}
                <div>
                  <Map
                    style={style}
                    containerStyle={mapStyle}
                    fitBounds={bounds ? bounds : [[0, 0], [0, 0]]}
                    fitBoundsOptions={{
                      padding: 30
                    }}
                    // center={project.coordinates}
                  >
                    <ZoomControl position="bottom-right" />

                    {features}
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
