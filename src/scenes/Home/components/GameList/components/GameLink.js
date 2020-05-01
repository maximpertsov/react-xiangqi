import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import actions, { toggleShowGame } from 'actions';

import styled from '@emotion/styled';

const Wrapper = styled.div`
  padding: 5px;
`;

const GameLink = ({ slug }) => {
  const dispatch = useDispatch();

  const setThisGameSlug = useCallback(() => {
    dispatch(actions.game.slug.set(slug));
    dispatch(toggleShowGame({ showGame: true }));
  }, [dispatch, slug]);

  return (
    <Wrapper>
      <Button fluid onClick={setThisGameSlug} className="GameLink">
        {slug}
      </Button>
    </Wrapper>
  );
};

GameLink.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default GameLink;
