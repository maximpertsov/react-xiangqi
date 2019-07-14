import PropTypes from 'prop-types';

export const playerPropType = PropTypes.shape({
  color: PropTypes.string.isRequired,
  name: PropTypes.string,
});

export default {};
