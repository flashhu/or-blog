import ActivityState from './ActivityState'
import TypeState from './TypeState'
import './index.less'

function CommitState() {
    return (
        <div className="state-wrapper">
            <ActivityState />
            <TypeState />
        </div>
    )
}

export default CommitState;