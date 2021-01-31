import React, { useEffect, useState } from 'react';
import DocTree from './DocTree';
import { observer } from 'mobx-react';

function Archive() {
  return (
    <div style={{ paddingBottom: 30 }}>
      <DocTree />
    </div>
  );
}

export default observer(Archive);
