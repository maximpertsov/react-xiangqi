import React, { useCallback } from 'react';

// import { useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

const UndoButton = () => {
  const undoSent = false; // useSelector(state => state.undoSent);

  const sendUndo = useCallback(() => {}, []);

  const renderUndoButton = () => (
    <Button onClick={sendUndo}>
      <Icon fitted name="undo" />
    </Button>
  );

  const renderUndoCancelButton = () => (
    <Button color="red" icon labelPosition="left">
      <Icon name="undo" />
      Cancel
    </Button>
  );

  if (undoSent) return renderUndoCancelButton();
  return renderUndoButton();
};

export default UndoButton;
