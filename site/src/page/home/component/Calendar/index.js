import React,{memo} from 'react'
import {Card} from 'antd';

import Calendar from './CommitCalendar/CalendarHeatMap'


export default memo(function FinCalendar (){
    return (
        <Card>
           <Calendar/>
        </Card>
    )
})