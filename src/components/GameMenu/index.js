import React, { Children } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import * as styles from 'commonStyles';

const Wrapper = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: repeat(
    ${props => Children.count(props.children)},
    1fr
  );
  text-align: center;
  ${styles.MEDIA_TINY} {
    width: ${styles.WIDTH_SIZE_TINY};
  }
  ${styles.MEDIA_SMALL} {
    width: ${styles.WIDTH_SIZE_SMALL};
  }
  ${styles.MEDIA_MEDIUM} {
    width: ${styles.WIDTH_SIZE_MEDIUM};
  }
  ${styles.MEDIA_LARGE} {
    width: ${styles.WIDTH_SIZE_LARGE};
  }
`;

const GameMenu = ({ children }) => (
  <Wrapper className="GameMenu">{children}</Wrapper>
);

GameMenu.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GameMenu;
