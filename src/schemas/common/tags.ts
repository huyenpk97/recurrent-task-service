enum TAGS {
  HELLO = 'hello',
  LABELS = 'labels',
  RECURRENT_TASKS = 'recurrent-tasks',
  LOGS = 'logs',
  CONFIGURATIONS = 'configurations'
}

const tags = [
  {
    name: TAGS.HELLO,
    description: 'Ways to say hello to the world'
  },
  {
    name: TAGS.LABELS,
    description: 'Operations (CRUD) on recurrent task labels'
  },
  {
    name: TAGS.RECURRENT_TASKS,
    description: 'Operations (CRUD) on recurrent tasks'
  },
  {
    name: TAGS.LOGS,
    description: 'Operations to get logs'
  },
  {
    name: TAGS.CONFIGURATIONS,
    description: 'Operations on configuraiton'
  }
];

export { TAGS, tags };

export default tags;
