import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledHeader = styled.header`
  display: flex;
  flex-flow: row nowrap;
  padding: 0 2rem;
  background-color: #000;
  color: #fff;

  a {
    color: #fff;
    padding: 1rem 0.5rem;
    text-decoration: none;
    transition: background 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const Header: FunctionComponent = () => (
  <StyledHeader>
    <Link to={'/projection'}>Projection</Link>
  </StyledHeader>
);

export default Header;
