const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce((acc, curr) => acc += curr.likes, 0)

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) return null
  return blogs.reduce((prev, curr) => (prev.likes > curr.likes) ? prev : curr, blogs[0])
}

const groupBlogsByAuthors = (blogs) => {
  return blogs.reduce(((acc, curr) => {
    const item = acc.find((x) => x.author === curr.author)
    if(item){
      ++item.blogs
    }
    else{
      acc.push({ author : curr.author, blogs : 1 })
    }
    return acc
  }),[])
}

const mostBlogs = (blogs) => {
  const results = groupBlogsByAuthors(blogs)
  return results.reduce((prev, curr) => (prev.blogs > curr.blogs) ? prev : curr, results[0]) || null
}

const groupLikesByAuthor = (blogs) => {
  return blogs.reduce(((acc, curr) => {
    const item = acc.find((x) => x.author === curr.author)
    if(item){
      item.likes += curr.likes
    }
    else{
      acc.push({ author : curr.author, likes : curr.likes })
    }
    return acc
  }),[])
}

const mostLikes = (blogs) => {
  const results = groupLikesByAuthor(blogs)
  return results.reduce((prev, curr) => (prev.likes > curr.likes) ? prev : curr, results[0]) || null
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}