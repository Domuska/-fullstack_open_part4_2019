const {
  totalLikes, favoriteBlog, mostBlogs, mostLikes,
} = require('../utils/listHelper');

const testBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

describe('total likes tests', () => {
  test('empty array to return 0', () => {
    expect(totalLikes([])).toBe(0);
  });

  test('return correct amount', () => {
    const dummyBlogs = [
      {
        likes: 1,
      },
      {
        likes: 10,
      },
    ];
    expect(totalLikes(dummyBlogs)).toBe(11);
  });

  test('with one blog returns its\' likes', () => {
    const dummyBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
      },
    ];
    expect(totalLikes(dummyBlogs)).toBe(5);
  });

  test('return correct amount if likes missing', () => {
    const dummyBlogs = [
      {
        likes: 25,
      },
      {
        likeeeees: 1,
      },
    ];
    expect(totalLikes(dummyBlogs)).toBe(25);
  });
});

describe('favorite blog tests', () => {
  test('empty array return null', () => {
    expect(favoriteBlog([])).toBe(null);
  });

  test('return correctly most liked one', () => {
    const expectedObject = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };

    expect(favoriteBlog(testBlogs)).toEqual(expectedObject);
  });

  test('return the single object it receives', () => {
    const blog = {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0,
    };
    const expectedObject = {
      author: blog.author,
      likes: blog.likes,
      title: blog.title,
    };

    expect(favoriteBlog([blog])).toEqual(expectedObject);
  });
});

describe('most blogs tests', () => {
  test('one blog as parameter, returns its\' author', () => {
    const blog = {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0,
    };
    const expectedObject = {
      author: blog.author,
      blogs: 1,
    };

    expect(mostBlogs([blog])).toEqual(expectedObject);
  });

  test('many blogs as parameter, return correctly calculated amount', () => {
    const expectedObject = {
      author: 'Robert C. Martin',
      blogs: 3,
    };

    expect(mostBlogs(testBlogs)).toEqual(expectedObject);
  });
});

describe.only('most likes tests', () => {
  test('returns the author with most likes', () => {
    const expectedObject = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    };
    expect(mostLikes(testBlogs)).toEqual(expectedObject);
  });

  test('return the single author as most popular when only one blog as param', () => {
    const blog = {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    };

    const expectedObject = {
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };

    expect(mostLikes([blog])).toEqual(expectedObject);
  });

  test('returns null with empty array as param', () => {
    expect(mostLikes([])).toBe(null);
  });
});
