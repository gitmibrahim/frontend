// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Loader } from 'semantic-ui-react';
import { H2, H3 } from 'libs/commonStyles';
import { secondary } from 'libs/colors';

// COMPONENTS
import ErrorHandler from 'shared_components/ErrorHandler';
import TripCarousel from './TripCarousel';

// ACTIONS/CONFIG

// STYLES
import { PageWrapper, SectionWrap, SectionContent } from '../../../shared_components/layout/Page';

const H2Secondary = styled(H2)`
  color: ${secondary};
`;

const Subtitle = styled(H3)`
  font-weight: lighter;
  margin-top: 0;
`;

const SectionHeader = styled.header`
  margin-bottom: 20px;
`;

export default class HomeSectionTrips extends React.Component {
  render() {
    const { isLoading, trips, retryFunction } = this.props;

    return (
      <React.Fragment>
        <PageWrapper>
          <SectionWrap>
            <SectionHeader>
              <H2Secondary>Featured Trips</H2Secondary>
              <Subtitle>
                Explore the best trips created by locals. They are{' '}
                <strong>100% customizable</strong> and <strong>we don’t charge you extra!</strong>
              </Subtitle>
            </SectionHeader>
          </SectionWrap>
        </PageWrapper>
        <PageWrapper>
          <SectionWrap>
            <SectionContent>
              {isLoading ? (
                <Loader active inline="centered" size="big" />
              ) : (
                <ErrorHandler retryFunction={retryFunction}>
                  <TripCarousel trips={trips} />
                </ErrorHandler>
              )}
            </SectionContent>
          </SectionWrap>
        </PageWrapper>
      </React.Fragment>
    );
  }
}

// Props Validation
HomeSectionTrips.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.object),
};
