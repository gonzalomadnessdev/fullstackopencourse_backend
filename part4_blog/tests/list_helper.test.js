const { test , describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

const _blogs = [
  {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    //arrange
    const blogs = []
    //act
    const result = listHelper.totalLikes(blogs)
    //assert
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals he likes of that', () => {
    //arrange
    const listWithOneBlog = [{ ..._blogs[0] }]
    //act
    const result = listHelper.totalLikes(listWithOneBlog)
    //assert
    assert.strictEqual(result, 7)
  })

  test('of a bigger list is calculated right', () => {
    //arrange
    const blogs = _blogs.map((b) => {return { ...b }})
    //act
    const result = listHelper.totalLikes(blogs)
    //assert
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('of an empty list is null', () => {
    //arrange
    const blogs = []
    //act
    const favBlog = listHelper.favoriteBlog(blogs)
    //assert
    assert.strictEqual(favBlog, null)
  })

  test('of a bigger list is right', () => {
    //arrange
    const blogs = _blogs.map((b) => {return { ...b }})
    //act
    const favBlog = listHelper.favoriteBlog(blogs)
    //assert
    assert.deepStrictEqual(favBlog, blogs[2])
  })
})

describe('author with most blogs', () => {
  test('of an empty list is null', () => {
    //arrange
    const blogs = []
    //act
    const result = listHelper.mostBlogs(blogs)
    //assert
    assert.strictEqual(result, null)
  })

  test('of a bigger list is calculated right', () => {
    //arrange
    const blogs = _blogs.map((b) => {return { ...b }})
    //act
    const result = listHelper.mostBlogs(blogs)
    //assert
    assert.strictEqual(result.author, 'Robert C. Martin')
  })
})

describe('author with most likes', () => {
  test('of an empty list is null', () => {
    //arrange
    const blogs = []
    //act
    const result = listHelper.mostLikes(blogs)
    //assert
    assert.strictEqual(result, null)
  })

  test('of a bigger list is calculated right', () => {
    //arrange
    const blogs = _blogs.map((b) => {return { ...b }})
    //act
    const result = listHelper.mostLikes(blogs)
    //assert
    assert.strictEqual(result.author, 'Edsger W. Dijkstra')
  })
})