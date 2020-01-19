import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Button } from "semantic-ui-react";
import { useDispatch } from "react-redux";

const GameLink = ({ slug }) => {
  const dispatch = useDispatch();

  const setThisGameSlug = useCallback(() => {
    dispatch({ type: "set_game_slug", gameSlug: slug });
    dispatch({ type: "toggle_show_game", showGame: true });
  }, [dispatch, slug]);

  return (
    <Button onClick={setThisGameSlug} className="GameLink">
      {slug}
    </Button>
  );
};

GameLink.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default GameLink;
