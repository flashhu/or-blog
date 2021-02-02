import React,{memo}from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import UpdateIcon from '@material-ui/icons/Update';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default memo(function ActivityStat() {
  const classes = useStyles();

  return (
    <Timeline align="alternate">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary">
            <UpdateIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>

        <TimelineContent>
        <TimelineOppositeContent>
          <Typography variant="body2" color="textSecondary">
            10:00 am
          </Typography>
        </TimelineOppositeContent>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h6" component="h1">
            最近更新
            </Typography>
            <a className="hvr-underline">文章标题占位1</a>
          </Paper>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" variant="outlined">
            <TrendingUpIcon/>
          </TimelineDot>
          <TimelineConnector className={classes.secondaryTail} />
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h6" component="h1">
              最常使用
            </Typography>
            <a className="hvr-underline">文章标题占位1</a>
            <a className="hvr-underline">文章标题占位2</a>
          </Paper>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="secondary">
            <EmojiObjectsIcon />
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h6" component="h1"> 
            </Typography>
            <Typography>共发布15篇</Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
})