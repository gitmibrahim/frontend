import React from 'react';
import styled from 'styled-components';
import { PlusIcon, MinusIcon } from 'shared_components/icons';

const SelectorWrapper = styled.div`
  position: ${props => (props.relative ? 'relative' : 'absolute')};
  background-color: white;
  box-shadow: ${props =>
    props.relative ? 'none' : '1px 1px 1px rgba(0, 0, 0, 0.3), -1px 1px 1px rgba(0, 0, 0, 0.3)'};
  width: 100%;
  max-width: 300px;
  margin: auto;
  left: 0;
  right: 0;
  padding: 15px;
  z-index: 5;
  color: #3c434b;
  font-weight: 500;
`;

const Row = styled.div`
  display: flex;
  height: 65px;
  align-items: center;
`;

const LeftColumn = styled.div`
  flex-shrink: 1;
  flex-wrap: wrap;
  margin-right: 20px;
`;
const RightColumn = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  line-height: 30px;
`;

const IconButton = styled.button`
  border: 1px solid #6fcf97;
  color: #6fcf97;
  border-radius: 20px;
  width: 32px;
  height: 32px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 0;
  :hover:enabled {
    background-color: #6fcf97;
    color: white;
    cursor: pointer;
  }
  :disabled {
    opacity: 0.5;
  }
`;

const NumberOfPeople = styled.span`
  min-width: 25px;
  margin: 0 10px;
  text-align: center;
`;

const ApplyButton = styled.button`
  outline: 0;
  background: transparent;
  border: 0;
  color: #6fcf97;
  font-size: 18px;
  display: block;
  cursor: pointer;
  margin: 20px auto 10px;
  font-weight: bold;
  :hover {
    color: #38d39f;
  }
`;

export default class GuestsSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: props.children,
      adults: props.adults,
      infants: props.infants,
    };
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    const rect = this.wrapperRef.current.getBoundingClientRect();
    if (rect.y + rect.height > window.innerHeight) {
      this.wrapperRef.current.style.top = `${window.innerHeight - (rect.height + rect.y)}px`;
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
      this.props.close();
    }
  };

  addAdult = () => {
    this.setState(prevState => ({
      adults: prevState.adults + 1,
    }));
  };

  addChild = () => {
    this.setState(prevState => ({
      children: prevState.children + 1,
    }));
  };

  addInfant = () => {
    this.setState(prevState => ({
      infants: prevState.infants + 1,
    }));
  };

  removeAdult = () => {
    this.setState(prevState => ({
      adults: prevState.adults - 1,
    }));
  };

  removeChild = () => {
    this.setState(prevState => ({
      children: prevState.children - 1,
    }));
  };

  removeInfant = () => {
    this.setState(prevState => ({
      infants: prevState.infants - 1,
    }));
  };

  applyChanges = () => {
    const { onApply } = this.props;
    onApply({
      ...this.state,
    });
  };

  render() {
    const { relative } = this.props;
    const { adults, infants, children } = this.state;

    return (
      <SelectorWrapper relative={relative} ref={this.wrapperRef}>
        <Row>
          <LeftColumn>
            Adults
            <br />
            (Ages > 13)
          </LeftColumn>
          <RightColumn>
            <IconButton disabled={adults === 1} onClick={this.removeAdult}>
              <MinusIcon style={{ width: 24, height: 24 }} />
            </IconButton>
            <NumberOfPeople>{adults}</NumberOfPeople>
            <IconButton onClick={this.addAdult}>
              <PlusIcon />
            </IconButton>
          </RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            Children
            <br />
            (Ages 2-12)
          </LeftColumn>
          <RightColumn>
            <IconButton disabled={children === 0} onClick={this.removeChild}>
              <MinusIcon style={{ width: 24, height: 24 }} />
            </IconButton>
            <NumberOfPeople>{children}</NumberOfPeople>
            <IconButton onClick={this.addChild}>
              <PlusIcon />
            </IconButton>
          </RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            Infants
            <br />
            (Under 2)
          </LeftColumn>
          <RightColumn>
            <IconButton disabled={infants === 0} onClick={this.removeInfant}>
              <MinusIcon style={{ width: 24, height: 24 }} />
            </IconButton>
            <NumberOfPeople>{infants}</NumberOfPeople>
            <IconButton onClick={this.addInfant}>
              <PlusIcon />
            </IconButton>
          </RightColumn>
        </Row>
        <ApplyButton onClick={this.applyChanges}>Apply</ApplyButton>
      </SelectorWrapper>
    );
  }
}
