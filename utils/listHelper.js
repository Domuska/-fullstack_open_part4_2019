const lodash = require('lodash');
const log = require('./logger'); // eslint-disable-line

const totalLikes = (blogs) => {
  const reducer = (likes, blog) => {
    if (blog.likes) {
      return likes + blog.likes;
    }
    return likes;
  };
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length > 0) {
    const reducer = (currentFavorite, blog) => {
      if (blog.likes > currentFavorite.likes) {
        return blog;
      }
      return currentFavorite;
    };
    const { title, author, likes } = blogs.reduce(reducer);
    return { title, author, likes };
  }
  return null;
};

const mostBlogs = (blogs) => {
  // todo could be refactored to use lodash like mostLikes. DIY version.
  const reducer = (accumulated, blog) => {
    // author's blogs calculated earlier?
    const authorCalculatedIndex = accumulated.findIndex(
      (element) => element.author === blog.author,
    );
    if (authorCalculatedIndex > -1) {
      // return new array, increment the blog amount for the author
      return accumulated.map((element) => {
        if (element.author !== blog.author) {
          return element;
        }
        return { ...element, blogs: element.blogs + 1 };
      });
    }
    accumulated.push({ author: blog.author, blogs: 1 });
    return accumulated;
  };
  const counted = blogs.reduce(reducer, []);
  // log.info(counted);

  const maxByCb = (object) => object.blogs;

  const maxElement = lodash.maxBy(counted, maxByCb);
  return maxElement;
};

const mostLikes = (blogs) => {
  // if you want to reason about this function, try removing .map function call and check the console.log output
  if (blogs.length > 0) {
    const likesPerAuthor = lodash(blogs)
    // groupBy creates an object where keys are 'author', and values are array of objects where the author is the 'author'
      .groupBy('author')
    // map object's properties, receive values of the property as first arg and the key as second arg
      .map((authorBlogs, author) => ({
        author,
        // authorBlogs only has objects where author is the same between them, sum all likes up
        likes: lodash.sumBy(authorBlogs, 'likes'),
      }))
      .value();
    // log.info(likesPerAuthor);
    const mostLiked = lodash.maxBy(likesPerAuthor, (object) => object.likes);
    return mostLiked;
  }
  return null;
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
