import { observer } from 'mobx-react';
import { CommitStat, ArticleList ,Calendar} from './component';
import './index.less';

function Home() {
  return (
    <div className="home">
      <CommitStat />
      <Calendar/>
      <ArticleList />
    </div>
  );
}

export default observer(Home);
