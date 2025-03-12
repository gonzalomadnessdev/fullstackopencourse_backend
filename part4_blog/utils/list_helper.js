const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce((acc, curr) => acc += curr.likes, 0)

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) return null
  return blogs.reduce((prev, curr) => (prev.likes > curr.likes) ? prev : curr, blogs[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}