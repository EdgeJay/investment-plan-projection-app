import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Body from './Body';

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;

  p {
    text-align: center;
  }
`;

const Loader: FunctionComponent = () => (
  <Body>
    <Container>
      <p>{'Loading'}</p>
    </Container>
  </Body>
);

export default Loader;
