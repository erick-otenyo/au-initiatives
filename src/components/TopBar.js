import React from "react";
import { Container, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <Menu
      size="large"
      fixed="top"
      borderless
      fluid
      style={{
        boxShadow: "none",
        borderRadius: 0,
        borderLeft: "none",
        borderRight: "none"
      }}
    >
      <Container fluid>
        <Link to={`${process.env.PUBLIC_URL}/`}>
          <Menu.Item header as="h3">
            AU Initiatives
          </Menu.Item>
        </Link>
      </Container>
    </Menu>
  );
};

export default TopBar;
