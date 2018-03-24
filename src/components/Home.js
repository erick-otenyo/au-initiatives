import React from "react";
import { Container, Card, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";
import projects from "./Projects";
import TextTruncate from "react-text-truncate"; // recommend

const Home = () => {
  return (
    <div>
      <Container>
        <Header as="h2">African Union Initiatives</Header>
        <div>
          <Card.Group centered itemsPerRow={2}>
            {projects.map(project => {
              return (
                <Link
                  to={`${process.env.PUBLIC_URL}/${project.id}`}
                  key={project.title}
                >
                  <Card link raised style={{ margin: "20px" }} color="red">
                    <Card.Content>
                      <Card.Header>{project.title}</Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <Card.Description>
                        <TextTruncate
                          line={2}
                          truncateText="…"
                          text={project.objective[0]}
                        />
                      </Card.Description>
                    </Card.Content>
                  </Card>
                </Link>
              );
            })}
          </Card.Group>
        </div>
      </Container>
    </div>
  );
};

export default Home;
