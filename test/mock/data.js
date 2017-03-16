module.exports = {
  User: [
    { id: 1, name: 'John',    email: 'John@google.com',   password: '$2a$10$5Ez0EqwriB8nARClf3S6/upqJiy6gy4/iTtpESpt45GZmMaRE9K1O', salt: '$2a$10$5Ez0EqwriB8nARClf3S6/u', },
    { id: 2, name: 'Tom',     email: 'tom@google.com',    password: '$2a$10$5Ez0EqwriB8nARClf3S6/upqJiy6gy4/iTtpESpt45GZmMaRE9K1O', salt: '$2a$10$5Ez0EqwriB8nARClf3S6/u', },
    { id: 3, name: 'Andy',    email: 'andy@google.com',   password: '$2a$10$5Ez0EqwriB8nARClf3S6/upqJiy6gy4/iTtpESpt45GZmMaRE9K1O', salt: '$2a$10$5Ez0EqwriB8nARClf3S6/u', },
    { id: 4, name: 'Donna',   email: 'donna@google.com',   password: '$2a$10$5Ez0EqwriB8nARClf3S6/upqJiy6gy4/iTtpESpt45GZmMaRE9K1O', salt: '$2a$10$5Ez0EqwriB8nARClf3S6/u', },
  ],

  Profile: [
    { id: 3, userId: 1, avatar: 'http://avatar.com/john.png' },
    { id: 2, userId: 3, avatar: 'http://avatar.com/andy.png' },
    { id: 1, userId: 4, avatar: 'http://avatar.com/donna.png' },
  ],

  Post: [
    { id: 1, userId: 1, thread: 'Post1', content: 'Content 1', },
    { id: 2, userId: 1, thread: 'Post2', content: 'Content 2', },
    { id: 3, userId: 1, thread: 'Post3', content: 'Content 3', },
    { id: 4, userId: 2, thread: 'Post1', content: 'Content 4', },
    { id: 5, userId: 3, thread: 'Post5', content: 'Content 5', },
    { id: 6, userId: 3, thread: 'Post6', content: 'Content 6', },
  ]
}