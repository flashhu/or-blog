import ActivityStat from './ActivityStat';
import TypeStat from './TypeStat';
import './index.less';

function CommitState() {
  return (
    <div className="state-wrapper">
      <ActivityStat />
      <TypeStat />
    </div>
  );
}

export default CommitState;
