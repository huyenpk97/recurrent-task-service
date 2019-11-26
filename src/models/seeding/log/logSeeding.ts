
import localPubsub from '../../../pubsub/LocalPubsub';
import RecurrentTaskLog from '../../../services/logs/RecurrentTaskLog';
import LabelLog from '../../../services/logs/LabelLog';
import LogModel from '../../Log';

export default async () => {
  await LogModel.deleteMany({});

  const noopLogger = {
    info: () => {}
  };
  
  const recurrentTaskLog = new RecurrentTaskLog(localPubsub, noopLogger);
  recurrentTaskLog.listen();
  
  const labelLog = new LabelLog(localPubsub, noopLogger);
  labelLog.listen();
};
