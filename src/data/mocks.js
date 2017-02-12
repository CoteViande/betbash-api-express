import faker from 'faker'

const mocks = {
  String: () => faker.random.word(),
  Int: () => faker.random.number(0, 100000),
  Query: () => ({
    author: (root, args) => {
      return { firstName: args.firstName, lastName: args.lastName };
    },
  }),
  Author: () => ({ firstName: () => faker.name.firstName(), lastName: () => faker.name.lastName() }),
  Post: () => ({ title: faker.lorem.sentence(), text: faker.lorem.paragraphs(3) }),
}

export default mocks