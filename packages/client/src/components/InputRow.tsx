/* eslint-disable react-hooks/exhaustive-deps */

import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import { numbers } from '@ipp/common';

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding: 1rem 0;
  align-items: center;

  label + label,
  label + button {
    margin-left: 0.5rem;
  }

  button {
    align-self: flex-end;

    &:disabled {
      background-color: grey;
    }
  }
`;

const InputField = styled.label`
  display: flex;
  flex-flow: column nowrap;
  flex: 0 0 200px;

  span + input {
    margin-top: 0.5rem;
  }

  input {
    font-size: 1rem;
    padding: 0.5rem;
  }
`;

/*
const SubmitButton = styled.button`
  background-color: darkblue;
  font-size: 1.2rem;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
`;
*/

type HandleSubmitFunc = (initialInvestment: number, monthlyInvestment: number) => void;

interface Props {
  initialInvestment?: number;
  monthlyInvestment?: number;
  handleSubmit?: HandleSubmitFunc;
}

const InputRow: FunctionComponent<Props> = ({
  initialInvestment = 0,
  monthlyInvestment = 0,
  handleSubmit = () => {},
}) => {
  const [initInvest, setInitInvest] = useState(initialInvestment);
  const [mnthInvest, setMnthInvest] = useState(monthlyInvestment);

  useEffect(() => {
    setInitInvest(initialInvestment);
    setMnthInvest(monthlyInvestment);
  }, []);

  const debouncedHandleSubmit = useRef(debounce<HandleSubmitFunc>(handleSubmit, 1000)).current;
  const dispatchHandleSubmit = (initialInvestment: number, monthlyInvestment: number) => {
    debouncedHandleSubmit(initialInvestment, monthlyInvestment);
  };

  return (
    <Container>
      <InputField>
        <span>Initial Investment</span>
        <input
          type={'text'}
          name={'initialInvestment'}
          value={initInvest}
          onChange={evt => {
            const newValue = numbers.convertToInt(evt.target.value);
            setInitInvest(newValue);
            dispatchHandleSubmit(newValue, mnthInvest);
          }}
        />
      </InputField>
      <InputField>
        <span>Monthly Investment</span>
        <input
          type={'text'}
          name={'monthlyInvestment'}
          value={mnthInvest}
          onChange={evt => {
            const newValue = numbers.convertToInt(evt.target.value);
            setMnthInvest(newValue);
            dispatchHandleSubmit(initInvest, newValue);
          }}
        />
      </InputField>
    </Container>
  );
};

export default InputRow;
