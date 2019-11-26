import RecurrentTaskModel from '../../RecurrentTask';
import getRecurrentTaskData from './recurrentTaskData';

const RecurrentTaskSeeding = async () => {
  console.log('Seeding recurrent tasks...');

  const recurrentTaskData = await getRecurrentTaskData();

  await RecurrentTaskModel.deleteMany({});

  await Promise.all(recurrentTaskData.map(recurrentTask => (new RecurrentTaskModel(recurrentTask)).save()));

  console.log('Recurrent task seeding completed.');
};

export default RecurrentTaskSeeding;
