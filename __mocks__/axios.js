const mock = jest.genMockFromModule('axios');

mock.get = jest.fn(url => {
  switch (url) {
    case 'fen':
      return Promise.resolve({ status: 200, data: {} });
  }
});

export default mock;
