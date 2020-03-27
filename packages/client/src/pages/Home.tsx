import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Body from '../components/Body';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  p {
    text-align: center;
    line-height: 1.5;
  }
`;

const Home: FunctionComponent = () => (
  <Body>
    <Container>
      <p>
        Welcome.
        <br />
        Tap on "Projection" to start.
      </p>
    </Container>
  </Body>
);

export default Home;
