import { combineReducers } from 'redux';
import gameReducer from 'scenes/Game/reducers';

export default combineReducers({ game: gameReducer });
