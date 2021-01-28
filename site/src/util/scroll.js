export const calculateScrollDistance = () => {
  const scrollTop = window.pageYOffset; // how much the user has scrolled by
  const winHeight = window.innerHeight;
  const docHeight = getDocHeight();

  const totalDocScrollLength = docHeight - winHeight;
  const scrollPostion = Math.round(scrollTop / totalDocScrollLength * 100);

  return scrollPostion;
};

const getDocHeight = () => {
  return Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight,
  );
};

// 缓动效果
const easeout = (start = 0, end = 0, rate = 3, callback) => {
  // console.log(start, end);
  if (start === end || typeof start !== 'number') {
    return;
  }

  const step = () => {
    start += (end - start) / rate;

    if (Math.abs(start - end) < 1) {
      callback(end, true);
      return;
    }
    callback(start, false);
    requestAnimationFrame(step);
  };

  step();
};

// 处理返回顶部
export const handleScrollTop = () => {
  easeout(document.documentElement.scrollTop, 0, 4, (value) => {
    document.documentElement.scrollTop = value;
  });
};
