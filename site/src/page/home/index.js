import { CommitStat, ArticleList } from './component';
import './index.less';

function Home() {
  return (
    <div className="home">
      <CommitStat />
      <ArticleList />
    </div>
  );
}

export default Home;
